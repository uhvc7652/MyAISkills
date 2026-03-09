"""
Anthropic Claude Tool Use 使用示例
演示如何加载 MyAISkills 中的技能并与 Anthropic Claude API 集成。
"""

import json
import glob
import os

# pip install anthropic
import anthropic


def load_skills(skills_dir: str = "skills") -> list[dict]:
    """从 skills/ 目录递归加载所有技能定义。"""
    skills = []
    pattern = os.path.join(skills_dir, "**", "*.json")
    for filepath in sorted(glob.glob(pattern, recursive=True)):
        with open(filepath, encoding="utf-8") as f:
            skill = json.load(f)
        skills.append(skill)
    print(f"已加载 {len(skills)} 个技能：{[s['name'] for s in skills]}")
    return skills


def skills_to_anthropic_tools(skills: list[dict]) -> list[dict]:
    """将技能定义转换为 Anthropic tools 格式。"""
    return [
        {
            "name": skill["name"],
            "description": skill["description"],
            "input_schema": skill["parameters"],
        }
        for skill in skills
    ]


def handle_tool_call(tool_name: str, tool_input: dict) -> str:
    """
    处理 Claude 的工具调用请求。
    实际项目中，此处应调用真实的技能实现逻辑。
    """
    print(f"\n[工具调用] {tool_name}({json.dumps(tool_input, ensure_ascii=False)})")

    # 模拟各技能的返回结果
    mock_responses = {
        "web_search": {
            "results": [
                {
                    "title": "AI技术最新动态",
                    "url": "https://example.com/ai-news",
                    "snippet": "2025年AI领域迎来多项重大突破...",
                }
            ]
        },
        "web_fetch": {
            "title": "示例网页",
            "url": tool_input.get("url", ""),
            "content": "这是网页的正文内容...",
            "fetched_at": "2025-06-01T10:00:00Z",
        },
        "file_read": {
            "content": "文件内容示例\n第二行\n第三行",
            "total_lines": 3,
            "size_bytes": 256,
        },
        "calculate": {
            "expression": tool_input.get("expression", ""),
            "result": 3.14159,
            "success": True,
        },
        "get_current_time": {
            "datetime": "2025年6月1日 星期日 10:00:00",
            "date": "2025-06-01",
            "time": "10:00:00",
            "weekday": "星期日",
            "timezone": tool_input.get("timezone", "Asia/Shanghai"),
        },
    }

    result = mock_responses.get(tool_name, {"message": f"技能 {tool_name} 执行成功"})
    return json.dumps(result, ensure_ascii=False)


def chat_with_tools(user_message: str, client: anthropic.Anthropic, tools: list[dict]) -> str:
    """使用工具与 Claude 进行多轮对话。"""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        # 将 assistant 的回复加入消息历史
        messages.append({"role": "assistant", "content": response.content})

        # 若停止原因不是工具调用，返回最终答案
        if response.stop_reason != "tool_use":
            # 提取文本内容
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text
            return ""

        # 处理工具调用并收集结果
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = handle_tool_call(block.name, block.input)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    }
                )

        messages.append({"role": "user", "content": tool_results})


def main():
    # 初始化 Anthropic 客户端（需设置 ANTHROPIC_API_KEY 环境变量）
    client = anthropic.Anthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY", "your-api-key-here")
    )

    # 加载技能并转换为 Anthropic tools 格式
    skills = load_skills()
    tools = skills_to_anthropic_tools(skills)

    # 示例对话
    questions = [
        "现在是几点？请告诉我上海时间",
        "帮我获取 https://example.com 这个网页的内容",
        "计算 3.14159 * 2 的结果",
    ]

    for question in questions:
        print(f"\n{'='*50}")
        print(f"用户：{question}")
        answer = chat_with_tools(question, client, tools)
        print(f"Claude：{answer}")


if __name__ == "__main__":
    main()
