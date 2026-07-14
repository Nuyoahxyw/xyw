(function () {
  "use strict";

  function keyword(w, ipa, cn, c, l, summary, detail, code, tip, speech, kind) {
    return { w, ipa, cn, c, l, summary, detail, code, tip, speech: speech || w, kind: kind || "保留关键字" };
  }

  const reserved = "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" ");
  const soft = "_ case match type".split(" ");

  const entries = [
    keyword("False", "/f\u0254\u02d0ls/", "佛尔斯", "字面量", 1, "布尔类型的假值单例。", "False 是 bool 的两个实例之一，在条件判断中表示假，并且作为整数参与运算时等于 0。它是区分大小写的保留关键字。", "enabled = False\nif not enabled:\n    print(\"disabled\")", "通常直接写 if flag 或 if not flag，不必与 False 使用 == 或 is 比较。", "false"),
    keyword("None", "/n\u028cn/", "纳恩", "字面量", 1, "表示没有值或缺少结果的单例对象。", "None 是 NoneType 的唯一实例，常用作默认参数、缺失标记或没有返回值的函数结果。身份检查应使用 is None。", "result = find_user(name)\nif result is None:\n    return", "不要在需要区分“缺失”和“明确传入 None”时复用同一个标记，可创建专用哨兵对象。", "none"),
    keyword("True", "/tru\u02d0/", "楚", "字面量", 1, "布尔类型的真值单例。", "True 是 bool 的两个实例之一，在条件判断中表示真，并且 bool 继承 int，因此数值运算中 True 等于 1。", "ready = True\nif ready:\n    start()", "复杂业务状态不宜堆叠多个布尔变量，枚举或数据类通常更清晰。", "true"),
    keyword("and", "/\u00e6nd/", "安德", "逻辑与比较", 1, "执行短路逻辑与并返回某个操作数。", "and 先计算左操作数；若其为假值就直接返回左值，否则返回右操作数。结果不一定是 bool，因此也常用于默认链式选择。", "user = current_user and current_user.profile", "and 优先级低于比较运算；混合多个条件时使用括号提升可读性。"),
    keyword("as", "/\u00e6z/", "艾兹", "导入与上下文", 1, "为导入项、上下文对象或异常绑定别名。", "as 在 import、with 和 except 等语句中给对象绑定局部名称。它不会复制对象，只是在当前作用域创建另一个引用。", "import numpy as np\n\nwith open(path) as file:\n    data = file.read()", "except Exception as exc 的异常变量会在处理块结束后被清理，避免形成引用环。"),
    keyword("assert", "/\u0259\u02c8s\u025c\u02d0rt/", "额-瑟特", "调试与验证", 1, "在调试模式下验证开发者认为必然成立的条件。", "assert 条件为假时抛出 AssertionError，可附带消息。以优化模式运行 Python 时断言可能被移除，因此它适合内部不变量而非外部输入验证。", "assert total >= 0, \"total must not be negative\"", "不要用 assert 检查权限、参数或文件格式；这些检查在优化模式下仍必须执行。"),
    keyword("async", "/e\u026a\u02c8s\u026a\u014bk/", "诶-辛克", "异步", 2, "声明协程函数、异步迭代或异步上下文。", "async 可与 def、for、with 组合。async def 调用后返回协程对象，函数体要在协程被 await 或调度后才真正运行。", "async def fetch(url):\n    async with session.get(url) as response:\n        return await response.text()", "async 不会自动创建线程；阻塞式 I/O 仍会卡住事件循环，需要异步库或执行器。", "A sync"),
    keyword("await", "/\u0259\u02c8we\u026at/", "额-维特", "异步", 2, "暂停当前协程直到可等待对象产生结果。", "await 只能用于允许的异步上下文。等待期间控制权交还事件循环，其他任务可以运行；恢复后表达式得到 awaitable 的结果或异常。", "data = await read_stream()", "不要用 time.sleep 阻塞异步函数，应使用事件循环提供的异步休眠。"),
    keyword("break", "/bre\u026ak/", "布雷克", "流程控制", 1, "立即结束最近一层 for 或 while 循环。", "break 把控制转移到循环之后，并且会跳过该循环配套的 else 子句。它只影响最近的一层循环。", "for item in items:\n    if item is None:\n        break", "循环 else 只在没有执行 break 时运行，这与普通 if-else 的含义不同。"),
    keyword("class", "/kl\u00e6s/", "克拉斯", "对象模型", 1, "执行类体并创建一个新的类对象。", "class 语句建立局部命名空间、执行类体，再通过元类创建类对象。它支持继承、描述符、装饰器和动态属性等 Python 对象模型能力。", "class User:\n    def __init__(self, name):\n        self.name = name", "类体在定义时执行，不是每次实例化都执行；可变类属性会被所有实例共享。"),
    keyword("continue", "/k\u0259n\u02c8t\u026anju\u02d0/", "肯-听纽", "流程控制", 1, "跳过当前循环迭代的剩余语句。", "continue 作用于最近一层 for 或 while，立即开始下一次迭代条件检查或取得下一个元素。它不会结束循环。", "for number in numbers:\n    if number < 0:\n        continue\n    total += number", "过多 continue 会分散流程；适量使用可减少深层 if 嵌套。"),
    keyword("def", "/def/", "德夫", "函数", 1, "定义函数并把函数对象绑定到名称。", "def 创建函数对象，但函数体只在调用时运行。参数可包含位置限定、仅关键字、默认值和可变参数，函数也可配合装饰器与类型标注。", "def greet(name: str, *, loud: bool = False) -> str:\n    text = f\"Hello, {name}\"\n    return text.upper() if loud else text", "默认参数在 def 执行时计算一次；不要把可变列表或字典直接作为默认值。", "def"),
    keyword("del", "/del/", "戴尔", "对象与绑定", 2, "删除名称绑定、属性、切片或容器元素。", "del 根据目标调用相应删除语义，例如移除局部名称、执行对象的 __delattr__ 或容器的 __delitem__。它不会保证对象立即销毁。", "del cache[key]\ndel items[2:5]\ndel temporary", "删除最后一个引用可能触发资源回收，但确定性资源释放应使用 with，而不是依赖 del。", "del"),
    keyword("elif", "/\u02c8el\u026af/", "艾利夫", "流程控制", 1, "在前一个 if/elif 不成立时继续检查条件。", "elif 是 else if 的紧凑语法，同一链条从上到下检查，命中第一个真条件后跳过其余分支。", "if score >= 90:\n    grade = \"A\"\nelif score >= 60:\n    grade = \"Pass\"\nelse:\n    grade = \"Retry\"", "条件顺序很重要，范围更具体或阈值更高的分支通常应放在前面。", "else if"),
    keyword("else", "/els/", "艾尔斯", "流程控制", 1, "提供条件、循环或异常结构的备用分支。", "else 可跟在 if 链后处理其余情况，也可跟在 for/while 后表示循环未 break，还可跟在 try 后表示没有抛出异常。", "for item in items:\n    if matches(item):\n        break\nelse:\n    print(\"not found\")", "循环 else 和 try else 是 Python 特有的高频易错点，应按“没有 break/没有异常”理解。"),
    keyword("except", "/\u026ak\u02c8sept/", "伊克塞普特", "异常处理", 1, "捕获 try 块抛出的匹配异常。", "except 可指定异常类型、类型元组和 as 绑定。处理器按顺序匹配，应先捕获具体异常，再考虑更宽泛的基类。", "try:\n    value = int(text)\nexcept ValueError as exc:\n    report(exc)", "避免裸 except，它还会捕获 KeyboardInterrupt 和 SystemExit 等通常不该吞掉的异常。"),
    keyword("finally", "/\u02c8fa\u026an\u0259li/", "发以纳利", "异常处理", 1, "无论 try 如何离开都执行清理代码。", "finally 会在正常结束、return、break 或异常传播前运行，适合恢复状态和释放无法通过上下文管理器处理的资源。", "handle = acquire()\ntry:\n    use(handle)\nfinally:\n    release(handle)", "finally 中的 return 或新异常可能覆盖原始返回值和异常，应尽量避免。"),
    keyword("for", "/f\u0254\u02d0r/", "佛尔", "循环与迭代", 1, "依次从可迭代对象取得元素并执行循环体。", "for 使用迭代协议，而不是传统三段式计数。它可以解包每个元素，并可跟 else 表示迭代自然结束、未被 break 中断。", "for index, value in enumerate(values):\n    print(index, value)", "不要在遍历字典或集合时直接修改其大小；可遍历副本或先收集修改项。"),
    keyword("from", "/fr\u028cm/", "弗拉姆", "导入与生成器", 1, "指定导入来源、委托生成器或设置异常原因。", "from 用于 from module import name、yield from iterable 和 raise error from cause 三种主要语境，分别表达来源、生成器委托与异常链。", "from pathlib import Path\n\nyield from child_generator()", "from module import * 会污染命名空间并削弱静态分析，模块内部通常应避免。"),
    keyword("global", "/\u02c8\u0261lo\u028ab\u0259l/", "格楼博", "作用域", 2, "声明函数中的名称绑定指向模块全局作用域。", "global 影响当前代码块对名称的赋值和删除，让它们操作模块级绑定，而不是创建局部变量。读取全局名称通常不需要声明。", "count = 0\n\ndef increment():\n    global count\n    count += 1", "大量 global 可变状态会增加测试和并发难度，通常更适合封装进对象或显式传参。"),
    keyword("if", "/\u026af/", "伊夫", "流程控制", 1, "根据对象的真值选择执行分支。", "if 会调用 Python 真值测试规则：False、None、数值零和空容器通常为假，也可由对象的 __bool__ 或 __len__ 自定义。", "if user and user.is_active:\n    grant_access(user)", "不要用 if value 判断需要区分零、空字符串和 None 的业务场景，应写出明确条件。"),
    keyword("import", "/\u026am\u02c8p\u0254\u02d0rt/", "因波特", "导入与上下文", 1, "查找并加载模块，然后建立名称绑定。", "import 通过导入系统查找模块，首次导入通常执行模块顶层代码并缓存到 sys.modules，后续导入复用缓存对象。", "import json\nfrom pathlib import Path", "导入可能执行代码；避免循环导入，并把有副作用的启动逻辑放在明确函数中。"),
    keyword("in", "/\u026an/", "因", "逻辑与迭代", 1, "测试成员关系，或连接循环变量与可迭代对象。", "in 在表达式中调用成员测试协议，在 for/推导式中引出迭代来源。对字典使用 in 默认测试键而不是值。", "if key in mapping:\n    value = mapping[key]\n\nfor item in items:\n    process(item)", "先测试再索引可能产生两次查找；字典场景可根据需求使用 get 或异常处理。"),
    keyword("is", "/\u026az/", "伊兹", "逻辑与比较", 1, "比较两个引用是否指向同一个对象。", "is 执行对象身份比较，不调用 __eq__。它最适合 None、Ellipsis 和自定义哨兵等单例，不用于一般数值或字符串内容比较。", "if result is None:\n    return", "不要依赖小整数或字符串驻留让 is 看似可用；内容相等应使用 ==。"),
    keyword("lambda", "/\u02c8l\u00e6md\u0259/", "兰姆达", "函数", 2, "创建只包含单个表达式的匿名函数。", "lambda 返回函数对象，可接受与普通函数相似的参数，但函数体只能是一个表达式。它会按闭包规则捕获外部名称。", "key_fn = lambda user: (user.age, user.name)\nusers.sort(key=key_fn)", "复杂逻辑、文档字符串或多条语句应使用 def；循环闭包要注意名称的延迟绑定。"),
    keyword("nonlocal", "/\u02ccn\u0251\u02d0n\u02c8lo\u028ak\u0259l/", "农-楼口", "作用域", 2, "让嵌套函数修改最近外层函数作用域的名称。", "nonlocal 要求名称已存在于某个封闭函数作用域，并把赋值指向该绑定。它不会搜索模块全局作用域。", "def counter():\n    value = 0\n    def next_value():\n        nonlocal value\n        value += 1\n        return value\n    return next_value", "嵌套可变状态复杂时，使用类或数据对象可能比 nonlocal 闭包更易维护。", "non local"),
    keyword("not", "/n\u0251\u02d0t/", "纳特", "逻辑与比较", 1, "对对象真值执行逻辑取反。", "not 先按真值协议判断操作数，再返回严格的 bool 结果。它的优先级低于普通比较、高于 and 和 or。", "if not items:\n    return []", "not in 和 is not 是组合比较运算，阅读时应作为整体理解。"),
    keyword("or", "/\u0254\u02d0r/", "奥尔", "逻辑与比较", 1, "执行短路逻辑或并返回某个操作数。", "or 先计算左操作数；若其为真值就直接返回左值，否则返回右操作数。它常用于简单默认值，但会把所有假值都视为缺失。", "display_name = nickname or username", "当空字符串或数值 0 是有效值时，不能用 or 代替明确的 None 判断。"),
    keyword("pass", "/p\u00e6s/", "帕斯", "流程控制", 1, "提供一个什么也不做的合法语句。", "pass 用于语法要求语句块但暂时或有意不执行操作的地方，例如空类、占位函数和明确忽略的异常处理器。", "class Marker:\n    pass\n\ndef later():\n    pass", "空 except: pass 会静默吞掉问题；只有确实能安全忽略时才使用。"),
    keyword("raise", "/re\u026az/", "瑞兹", "异常处理", 1, "抛出异常或重新抛出当前处理中的异常。", "raise 可抛出异常实例或异常类。except 中单独写 raise 会保留原始 traceback；raise new_error from cause 可建立明确异常链。", "if age < 0:\n    raise ValueError(\"age must be non-negative\")", "应选择语义明确的异常类型，并避免在底层把所有异常无差别转换掉。"),
    keyword("return", "/r\u026a\u02c8t\u025c\u02d0rn/", "瑞-特恩", "函数", 1, "结束当前函数并把结果交给调用方。", "return 后可跟任意表达式；没有表达式或函数自然结束时返回 None。在生成器中 return value 会通过 StopIteration.value 结束生成。", "def square(value):\n    return value * value", "finally 中的 return 会覆盖 try 中的返回或异常，通常是危险写法。"),
    keyword("try", "/tra\u026a/", "踹", "异常处理", 1, "建立带 except、else 或 finally 的异常边界。", "try 包围可能失败的操作，后面必须至少有 except 或 finally。else 只在没有异常时运行，finally 则无论如何都会运行。", "try:\n    config = load(path)\nexcept OSError as exc:\n    report(exc)\nelse:\n    apply(config)", "try 块应尽量只包含预期可能失败的操作，避免宽泛处理掩盖其他编程错误。"),
    keyword("while", "/wa\u026al/", "外尔", "循环与迭代", 1, "在条件保持真值时重复执行代码块。", "while 每轮开始前进行真值测试，因此可能一次也不执行。它也支持 else，只有循环未被 break 中断时才运行。", "while queue:\n    process(queue.popleft())", "确保循环状态会推进；CPU 密集的无限循环应明确让出控制或等待事件。"),
    keyword("with", "/w\u026a\u00f0/", "维兹", "资源与上下文", 1, "通过上下文管理协议包围进入和退出逻辑。", "with 调用对象的 __enter__ 和 __exit__，即使块内抛出异常也执行退出逻辑。常用于文件、锁、事务和临时状态。", "with open(path, encoding=\"utf-8\") as file:\n    text = file.read()", "需要同时管理多个资源时可在一个 with 中列出多个上下文，或使用 ExitStack。"),
    keyword("yield", "/ji\u02d0ld/", "伊尔德", "函数与生成器", 2, "从生成器产生值并暂停函数状态。", "函数体出现 yield 后会成为生成器函数。每次迭代恢复到上次暂停处；yield from 可把发送、异常和返回值协议委托给子迭代器。", "def count_to(limit):\n    for value in range(1, limit + 1):\n        yield value", "生成器通常惰性执行，异常可能在迭代时而不是创建生成器时出现。"),
    keyword("_", "/\u02c8\u028cnd\u0259rsk\u0254\u02d0r/", "安德斯寇", "模式匹配", 2, "在 match 模式中表示不绑定值的通配符。", "_ 只在结构化模式匹配的特定位置具有软关键字意义，能匹配任意值但不建立名称绑定。在其他 Python 代码中它仍可作为普通标识符。", "match response:\n    case {\"status\": 200, \"data\": data}:\n        use(data)\n    case _:\n        handle_error()", "交互式解释器、国际化和忽略变量也常使用 _，这些惯例可能与通配符含义重叠。", "underscore", "软关键字"),
    keyword("case", "/ke\u026as/", "凯斯", "模式匹配", 2, "在 match 语句中声明一个模式与可选守卫分支。", "case 是 match 代码块内的软关键字。分支从上到下尝试，第一个结构模式匹配且 if 守卫成立的分支会执行。", "match command:\n    case [\"move\", x, y]:\n        move(int(x), int(y))\n    case _:\n        help()", "捕获模式中的裸名称会绑定任何值，可能使后续 case 永远不可到达。", "case", "软关键字"),
    keyword("match", "/m\u00e6t\u0283/", "麦奇", "模式匹配", 2, "开始结构化模式匹配语句。", "match 先计算主题值，再让各 case 按结构、类型形态、字面量和守卫条件匹配。它不是简单 switch，也不会调用普通赋值解包。", "match point:\n    case (0, 0):\n        label = \"origin\"\n    case (x, y):\n        label = f\"{x}, {y}\"", "match/case 是软关键字，在不构成匹配语法的位置仍可用作普通变量名，但不建议混用。", "match", "软关键字"),
    keyword("type", "/ta\u026ap/", "泰普", "类型标注", 2, "在 type 语句中声明显式类型别名。", "type 是类型别名语句中的软关键字。它创建 TypeAliasType，并支持泛型参数及延迟计算别名值，比普通赋值更明确地表达类型别名意图。", "type Point = tuple[float, float]\ntype Pair[T] = tuple[T, T]", "type 语句不是创建运行时类；需要行为、方法和实例构造时仍应使用 class。", "type", "软关键字")
  ];

  const byWord = new Map(entries.map(item => [item.w, item]));
  const keywords = [...reserved, ...soft].map(word => {
    const item = byWord.get(word);
    if (!item) throw new Error(`Missing Python keyword content: ${word}`);
    return item;
  });

  window.LANGUAGE_BANKS = window.LANGUAGE_BANKS || {};
  window.LANGUAGE_BANKS.python = {
    id: "python",
    name: "Python",
    mark: "Py",
    standard: "Python 3.13 · 39 个特殊词汇",
    keywords,
    reserved: [...reserved],
    contextual: [...soft]
  };
})();
