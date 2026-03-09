"""
OpenAI Function Calling 使用示例
演示如何加载 MyAISkills 中的技能并与 OpenAI API 集成。
"""

import json
import glob
import os
from typing import Optional

# pip install openai
from openai import OpenAI

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SKILLS_DIR = os.path.join(REPO_ROOT, "skills")

def load_skills(skills_dir: Optional[str] = None) -> list[dict]:
    """从 skills/ 目录递归加载所有技能定义。"""
    skills_dir = skills_dir or os.environ.get("MYAI_SKILLS_DIR", DEFAULT_SKILLS_DIR)
    skills = []
    pattern = os.path.join(skills_dir, "**", "*.json")
    for filepath in sorted(glob.glob(pattern, recursive=True)):
        with open(filepath, encoding="utf-8") as f:
            skill = json.load(f)
        skills.append(skill)
    print(f"已加载 {len(skills)} 个技能：{[s['name'] for s in skills]}")
    return skills


def skills_to_openai_tools(skills: list[dict]) -> list[dict]:
    """将技能定义转换为 OpenAI tools 格式。"""
    return [
        {
            "type": "function",
            "function": {
                "name": skill["name"],
                "description": skill["description"],
                "parameters": skill["parameters"],
            },
        }
        for skill in skills
    ]


def handle_tool_call(tool_name: str, tool_args: dict) -> str:
    """
    处理 AI 的工具调用请求。
    实际项目中，此处应调用真实的技能实现逻辑。
    """
    print(f"\n[工具调用] {tool_name}({json.dumps(tool_args, ensure_ascii=False)})")

    # 模拟各技能的返回结果
    mock_responses = {
        "web_search": {
            "results": [
                {
                    "title": "2025年AI大模型最新进展",
                    "url": "https://example.com/ai-news",
                    "snippet": "本文介绍了2025年AI领域的重大突破...",
                }
            ]
        },
        "get_current_time": {
            "datetime": "2025年6月1日 星期日 10:00:00",
            "date": "2025-06-01",
            "time": "10:00:00",
            "weekday": "星期日",
            "timezone": "Asia/Shanghai",
        },
        "calculate": {
            "expression": tool_args.get("expression", ""),
            "result": 42,
            "success": True,
        },
    }

    result = mock_responses.get(tool_name, {"message": f"技能 {tool_name} 执行成功"})
    return json.dumps(result, ensure_ascii=False)


def chat_with_tools(user_message: str, client: OpenAI, tools: list[dict]) -> str:
    """使用工具与 OpenAI 进行多轮对话。"""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        message = response.choices[0].message
        messages.append(message)

        # 若无工具调用，返回最终答案
        if not message.tool_calls:
            return message.content

        # 处理工具调用
        for tool_call in message.tool_calls:
            args = json.loads(tool_call.function.arguments)
            result = handle_tool_call(tool_call.function.name, args)
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                }
            )


def main():
    # 初始化 OpenAI 客户端（需设置 OPENAI_API_KEY 环境变量）
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "your-api-key-here"))

    # 加载技能并转换为 OpenAI tools 格式
    skills = load_skills()
    tools = skills_to_openai_tools(skills)

    # 示例对话
    questions = [
        "现在北京时间是几点？",
        "帮我计算 sqrt(2) 的值，保留 4 位小数",
        "搜索一下最新的 AI 大模型新闻",
    ]

    for question in questions:
        print(f"\n{'='*50}")
        print(f"用户：{question}")
        answer = chat_with_tools(question, client, tools)
        print(f"AI：{answer}")


if __name__ == "__main__":
    main()
