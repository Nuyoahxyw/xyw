/*
 * Assumptions: beginner-to-intermediate Chinese learners, offline use, no C# version claims.
 * Pronunciations are practical General American IPA plus a Chinese approximation.
 */
window.KEYWORDS = [
  {
    w: "abstract", ipa: "/\u02c8\u00e6bstr\u00e6kt/", cn: "艾布斯特拉克特", c: "面向对象", l: 2,
    summary: "声明不能直接实例化、需要由派生类型补全的类或成员。",
    detail: "用于抽象类或抽象成员。抽象类可以包含已实现成员，但不能直接 new；抽象成员只声明契约，没有方法体，非抽象派生类必须使用 override 实现它。",
    code: "abstract class Shape\n{\n    public abstract double Area();\n}",
    tip: "abstract 与 virtual 不同：virtual 已有默认实现，abstract 没有实现。"
  },
  {
    w: "as", ipa: "/\u00e6z/", cn: "艾兹", c: "类型系统", l: 2,
    summary: "执行安全的引用类型或可空类型转换，失败时得到 null。",
    detail: "as 不会在转换失败时抛出 InvalidCastException，而是返回 null，适合随后做空值检查。它不能用于普通非可空值类型之间的数值转换。",
    code: "object value = \"C#\";\nstring? text = value as string;",
    tip: "如果只想判断并取得值，优先考虑 is 模式匹配，通常更简洁。"
  },
  {
    w: "async", ipa: "/\u0259\u02c8s\u026a\u014bk/", cn: "额-辛克", c: "异步", l: 2,
    summary: "标记可使用 await 的异步方法、Lambda 或匿名方法。",
    detail: "async 使方法能够在等待异步操作时把控制权交还调用方。它本身不会创建新线程；真正的异步行为来自被 await 的任务。常见返回类型是 Task、Task<T>、ValueTask 或 void（仅事件处理器）。",
    code: "async Task<string> LoadAsync()\n{\n    return await File.ReadAllTextAsync(\"a.txt\");\n}",
    tip: "避免 async void；调用方无法等待它，也很难统一处理异常。"
  },
  {
    w: "await", ipa: "/\u0259\u02c8we\u026at/", cn: "额-维特", c: "异步", l: 2,
    summary: "异步等待任务完成，同时避免阻塞当前线程。",
    detail: "await 检查等待对象是否完成；未完成时保存当前方法的后续执行状态并返回调用方，完成后再继续。它通常位于 async 方法中，也可在支持的顶级语句等上下文使用。",
    code: "string json = await client.GetStringAsync(url);",
    tip: "await 与 .Result 不等价；.Result 会同步阻塞并可能造成死锁。"
  },
  {
    w: "base", ipa: "/be\u026as/", cn: "贝斯", c: "面向对象", l: 1,
    summary: "访问基类成员或调用基类构造函数。",
    detail: "在派生类中，base 可明确选择基类版本的字段、属性或方法，也可在构造函数初始化器中调用某个基类构造函数。它用于表达继承链上的上一层，而不是当前对象。",
    code: "class Dog : Animal\n{\n    public Dog(string name) : base(name) { }\n}",
    tip: "base 不是基类对象的独立副本；它仍然作用于当前实例。"
  },
  {
    w: "bool", ipa: "/bu\u02d0l/", cn: "布尔", c: "基础类型", l: 1,
    summary: "声明只包含 true 或 false 的布尔值类型。",
    detail: "bool 是 System.Boolean 的 C# 别名，常用于条件、状态和逻辑表达式。C# 不允许把整数隐式当成布尔值，因此 if (1) 是非法的。",
    code: "bool isReady = count > 0;\nif (isReady) Start();",
    tip: "不要写 flag == true；直接写 if (flag) 更清楚。"
  },
  {
    w: "break", ipa: "/bre\u026ak/", cn: "布雷克", c: "流程控制", l: 1,
    summary: "立即结束最近一层循环或 switch。",
    detail: "break 把控制转移到当前 for、foreach、while、do 或 switch 语句之后。它只退出最近的一层结构，不会自动结束外层循环或整个方法。",
    code: "foreach (var item in items)\n{\n    if (item is null) break;\n}",
    tip: "退出多层循环时可提取方法并 return，通常比标志变量更清晰。"
  },
  {
    w: "byte", ipa: "/ba\u026at/", cn: "拜特", c: "基础类型", l: 1,
    summary: "声明 0 到 255 的 8 位无符号整数。",
    detail: "byte 是 System.Byte 的别名，占 8 位，常用于二进制数据、流和像素通道。算术表达式通常会提升为 int，因此两个 byte 相加的结果不能无条件再赋给 byte。",
    code: "byte channel = 255;\nbyte[] buffer = new byte[1024];",
    tip: "需要 -128 到 127 时使用 sbyte，而不是 byte。"
  },
  {
    w: "case", ipa: "/ke\u026as/", cn: "凯斯", c: "流程控制", l: 1,
    summary: "在 switch 中定义一个匹配分支。",
    detail: "case 后可跟常量模式、类型模式、关系模式等。匹配成功时执行对应语句；现代 C# 还可配合 when 添加守卫条件。",
    code: "switch (status)\n{\n    case 200: HandleOk(); break;\n    case >= 400: HandleError(); break;\n}",
    tip: "大多数 case 不允许隐式贯穿到下一分支，需要 break、return 或 goto。"
  },
  {
    w: "catch", ipa: "/k\u00e6t\u0283/", cn: "凯奇", c: "异常处理", l: 1,
    summary: "捕获 try 块中抛出的匹配异常。",
    detail: "catch 可指定异常类型和变量，并可用 when 过滤条件。应先写具体异常，最后才是宽泛异常；只捕获自己能够处理、转换或记录的异常。",
    code: "try { Save(); }\ncatch (IOException ex)\n{\n    Log(ex.Message);\n}",
    tip: "空 catch 会吞掉故障信息，通常会让问题更难定位。"
  },
  {
    w: "char", ipa: "/t\u0283\u0251\u02d0r/", cn: "恰尔", c: "基础类型", l: 1,
    summary: "声明一个 UTF-16 代码单元。",
    detail: "char 是 System.Char 的别名，用单引号表示。一个 char 占 16 位，但并不保证代表用户看到的完整 Unicode 字符；某些字符需要一对代理项。",
    code: "char grade = 'A';\nchar newline = '\\n';",
    tip: "字符串用双引号，char 用单引号；表情符号常不能装进一个 char。"
  },
  {
    w: "checked", ipa: "/t\u0283ekt/", cn: "切克特", c: "数值与内存", l: 2,
    summary: "要求整数运算溢出时抛出异常。",
    detail: "checked 为整型算术和显式数值转换启用溢出检查。溢出时通常抛出 OverflowException；可作为语句块或表达式使用。",
    code: "int result = checked(int.MaxValue + 1);",
    tip: "浮点运算不受 checked 控制；浮点溢出遵循 IEEE 754 行为。"
  },
  {
    w: "class", ipa: "/kl\u00e6s/", cn: "克拉斯", c: "面向对象", l: 1,
    summary: "声明引用类型的类。",
    detail: "类可封装字段、属性、方法、事件和嵌套类型，并支持单继承与多接口实现。类变量保存的是对象引用；多个变量可能指向同一个实例。",
    code: "class Person\n{\n    public string Name { get; init; } = \"\";\n}",
    tip: "class 是引用类型；需要值语义与轻量数据时再考虑 struct 或 record struct。"
  },
  {
    w: "const", ipa: "/k\u0251\u02d0nst/", cn: "康斯特", c: "成员与修饰符", l: 1,
    summary: "声明编译期常量。",
    detail: "const 值必须能在编译期确定，并在声明时赋值。它隐含为静态，适合数字、字符、字符串、布尔和枚举等常量。使用方编译后可能直接嵌入其值。",
    code: "const int MaxRetries = 3;",
    tip: "跨程序集可能变化的值更适合 static readonly，避免旧调用方保留内嵌值。"
  },
  {
    w: "continue", ipa: "/k\u0259n\u02c8t\u026anju\u02d0/", cn: "肯-听纽", c: "流程控制", l: 1,
    summary: "跳过本次循环剩余语句，开始下一次迭代。",
    detail: "continue 作用于最近一层循环。在 for 中会先执行迭代表达式；在 while 或 foreach 中直接进入下一轮条件判断或下一个元素。",
    code: "foreach (var n in numbers)\n{\n    if (n < 0) continue;\n    total += n;\n}",
    tip: "适量使用 continue 可减少嵌套，但过多跳转会让流程难以追踪。"
  },
  {
    w: "decimal", ipa: "/\u02c8des\u026am\u0259l/", cn: "德西莫", c: "基础类型", l: 1,
    summary: "声明高精度十进制定点数。",
    detail: "decimal 是 System.Decimal 的别名，128 位表示，特别适合金额等十进制精度重要的计算。字面量通常加 m 或 M 后缀。",
    code: "decimal price = 19.99m;\ndecimal total = price * quantity;",
    tip: "decimal 不是无限精度；金融规则仍需明确舍入方式。"
  },
  {
    w: "default", ipa: "/d\u026a\u02c8f\u0254\u02d0lt/", cn: "迪-佛特", c: "类型系统", l: 1,
    summary: "取得类型的默认值，或表示 switch 的兜底分支。",
    detail: "default(T) 返回 T 的默认值：数值为零、bool 为 false、引用为 null、结构体为字段默认组合。default 也可作为目标类型推断表达式，或在 switch 中匹配未处理情况。",
    code: "int zero = default;\nstring? text = default;",
    tip: "默认值不一定是业务上的有效值，尤其是 DateTime 和自定义结构体。"
  },
  {
    w: "delegate", ipa: "/\u02c8del\u026a\u0261\u0259t/", cn: "德里格特", c: "委托与事件", l: 2,
    summary: "声明可引用一个或多个方法的类型。",
    detail: "委托是类型安全的方法引用，规定参数与返回值签名。实例可指向静态或实例方法，也可组合为多播委托，是事件、回调和 Lambda 的基础。",
    code: "delegate int Transform(int value);\nTransform square = x => x * x;",
    tip: "常见签名可直接使用 Action、Func 和 Predicate，不必总声明新委托。"
  },
  {
    w: "do", ipa: "/du\u02d0/", cn: "杜", c: "流程控制", l: 1,
    summary: "创建至少执行一次的 do-while 循环。",
    detail: "do 循环先执行循环体，再判断 while 条件，因此即使条件最初为 false，循环体也会运行一次。适合菜单、输入验证等先执行后判断的场景。",
    code: "do\n{\n    input = Console.ReadLine();\n}\nwhile (string.IsNullOrEmpty(input));",
    tip: "结尾的 while 条件后需要分号。"
  },
  {
    w: "double", ipa: "/\u02c8d\u028cb\u0259l/", cn: "达博", c: "基础类型", l: 1,
    summary: "声明 64 位双精度浮点数。",
    detail: "double 是 System.Double 的别名，也是带小数点实数字面量的默认类型。它范围大、速度快，但许多十进制小数无法精确表示。",
    code: "double ratio = 1.0 / 3.0;",
    tip: "不要直接用 == 比较计算得到的浮点数；使用容差比较。"
  },
  {
    w: "else", ipa: "/els/", cn: "艾尔斯", c: "流程控制", l: 1,
    summary: "在 if 条件为 false 时执行替代分支。",
    detail: "else 与最近一个尚未配对的 if 结合。可写成 else if 构成多分支判断；最后的 else 可覆盖其余所有情况。",
    code: "if (score >= 60) Pass();\nelse Retry();",
    tip: "无大括号的嵌套 if 容易产生悬挂 else，团队代码中建议始终加括号。"
  },
  {
    w: "enum", ipa: "/\u02c8i\u02d0n\u028cm/", cn: "伊纳姆", c: "类型系统", l: 1,
    summary: "声明一组具名整数常量。",
    detail: "枚举为有限状态赋予可读名称，默认底层类型是 int，成员默认从 0 递增。可以指定底层整数类型和显式值；配合 FlagsAttribute 表示可组合位标志。",
    code: "enum Status\n{\n    Pending, Running, Done\n}",
    tip: "反序列化或强制转换可能得到未声明的数值，必要时用 Enum.IsDefined 验证。"
  },
  {
    w: "event", ipa: "/\u026a\u02c8vent/", cn: "伊-文特", c: "委托与事件", l: 2,
    summary: "声明只允许发布者触发的委托成员。",
    detail: "event 基于委托建立发布/订阅机制。外部代码可以用 += 订阅、用 -= 取消订阅，但不能直接调用或覆盖事件委托；只有声明类型能够触发它。",
    code: "public event EventHandler? Saved;\nSaved?.Invoke(this, EventArgs.Empty);",
    tip: "长期对象订阅短期对象通常没问题；反向订阅要注意取消，避免内存泄漏。"
  },
  {
    w: "explicit", ipa: "/\u026ak\u02c8spl\u026as\u026at/", cn: "伊克斯普利西特", c: "类型系统", l: 3,
    summary: "声明必须由强制转换语法调用的用户定义转换。",
    detail: "explicit 转换用于可能丢失信息或失败的类型转换。调用者必须写出目标类型，明确承担风险。转换运算符必须是 public static。",
    code: "public static explicit operator int(Temperature t)\n    => (int)t.Celsius;",
    tip: "如果转换总能成功且不丢信息，才考虑 implicit。"
  },
  {
    w: "extern", ipa: "/\u026ak\u02c8st\u025c\u02d0rn/", cn: "伊克斯特恩", c: "成员与修饰符", l: 3,
    summary: "声明方法实现在当前 C# 源码之外。",
    detail: "extern 常与 DllImport 等互操作机制一起使用，表示方法没有 C# 方法体，实现在原生库或其他外部环境中。也可用于 extern alias 解决程序集别名冲突。",
    code: "[DllImport(\"user32.dll\")]\nstatic extern int MessageBox(IntPtr h, string t, string c, uint type);",
    tip: "平台调用需要格外核对字符集、调用约定和参数内存布局。"
  },
  {
    w: "false", ipa: "/f\u0254\u02d0ls/", cn: "佛尔斯", c: "字面量", l: 1,
    summary: "布尔类型的假值字面量。",
    detail: "false 是 bool 的两个值之一，常用于条件结果、初始状态和逻辑表达式。它不是整数 0，也不能与 0 隐式互换。",
    code: "bool completed = false;",
    tip: "可空 bool 还有第三种状态 null，判断时要明确业务含义。"
  },
  {
    w: "finally", ipa: "/\u02c8fa\u026an\u0259li/", cn: "发以纳利", c: "异常处理", l: 2,
    summary: "无论 try 是否成功都尽量执行的清理块。",
    detail: "finally 在正常完成、return 或异常传播时都会执行，适合释放非 using 管理的资源和恢复状态。它通常不负责处理异常，而负责收尾。",
    code: "try { UseResource(); }\nfinally { resource.Close(); }",
    tip: "不要在 finally 中 return 或抛出新异常，这可能掩盖原始异常。"
  },
  {
    w: "fixed", ipa: "/f\u026akst/", cn: "菲克斯特", c: "数值与内存", l: 3,
    summary: "在 unsafe 代码中固定可移动对象的内存位置。",
    detail: "垃圾回收器可能移动托管对象。fixed 在限定作用域内固定数组、字符串或字段，并取得指针，常用于原生互操作和高性能底层代码。",
    code: "unsafe\n{\n    fixed (byte* p = buffer)\n        NativeRead(p);\n}",
    tip: "固定时间应尽可能短；长时间 pin 会影响垃圾回收器整理内存。"
  },
  {
    w: "float", ipa: "/flo\u028at/", cn: "弗洛特", c: "基础类型", l: 1,
    summary: "声明 32 位单精度浮点数。",
    detail: "float 是 System.Single 的别名，精度和范围低于 double，但占用更少空间。实数字面量需要 f 或 F 后缀，否则默认是 double。",
    code: "float opacity = 0.75f;",
    tip: "科学计算通常优先 double；大量图形或模型数据可能选择 float。"
  },
  {
    w: "for", ipa: "/f\u0254\u02d0r/", cn: "佛尔", c: "流程控制", l: 1,
    summary: "按初始化、条件和迭代步骤执行循环。",
    detail: "for 把循环变量初始化、继续条件和每轮后的更新集中在语句头中，适合已知索引或次数的迭代。三个部分都可以省略，但分号必须保留。",
    code: "for (int i = 0; i < items.Count; i++)\n{\n    Console.WriteLine(items[i]);\n}",
    tip: "遍历集合且不需要索引时，foreach 通常更安全、可读。"
  },
  {
    w: "foreach", ipa: "/f\u0254\u02d0r i\u02d0t\u0283/", cn: "佛尔-伊奇", c: "流程控制", l: 1,
    summary: "依次迭代可枚举序列中的元素。",
    detail: "foreach 使用枚举模式访问数组、集合、迭代器及其他可枚举对象。它隐藏索引和 MoveNext 细节，并在合适时自动释放枚举器。",
    code: "foreach (string name in names)\n{\n    Console.WriteLine(name);\n}",
    tip: "遍历期间通常不能修改原集合结构，否则枚举器可能抛异常。"
  },
  {
    w: "get", ipa: "/\u0261et/", cn: "盖特", c: "成员与修饰符", l: 1,
    summary: "定义属性或索引器读取值的访问器。",
    detail: "get 在读取属性时执行并返回该属性值。自动属性可只写 get 表示构造后只读，也可使用表达式体计算结果。",
    code: "public string FullName\n{\n    get => $\"{First} {Last}\";\n}",
    tip: "属性 getter 通常应快速且无明显副作用，否则调用者会难以预期。"
  },
  {
    w: "goto", ipa: "/\u02c8\u0261o\u028atu\u02d0/", cn: "勾-图", c: "流程控制", l: 3,
    summary: "把控制转移到同一方法内的标签或 switch 分支。",
    detail: "goto 可跳到命名标签，也可在 switch 中写 goto case 或 goto default。它有少量适合状态机或退出深层结构的场景，但会削弱结构化流程。",
    code: "if (retry) goto Start;\nStart:\nRun();",
    tip: "优先使用循环、return 或提取方法；只有流程确实更清楚时才用 goto。"
  },
  {
    w: "if", ipa: "/\u026af/", cn: "伊夫", c: "流程控制", l: 1,
    summary: "根据布尔条件选择是否执行代码块。",
    detail: "if 的条件必须是 bool 表达式。可以接 else 或 else if 构成互斥分支；模式匹配常用于同时判断类型和提取值。",
    code: "if (value is string text && text.Length > 0)\n{\n    Print(text);\n}",
    tip: "复杂条件应提取为有意义的布尔变量或方法，避免难读的长表达式。"
  },
  {
    w: "implicit", ipa: "/\u026am\u02c8pl\u026as\u026at/", cn: "因普利西特", c: "类型系统", l: 3,
    summary: "声明编译器可自动应用的用户定义转换。",
    detail: "implicit 适合始终成功且不造成明显信息丢失的转换。调用代码不需要强制转换语法，因此设计不当会制造隐藏成本或歧义。",
    code: "public static implicit operator Celsius(double value)\n    => new(value);",
    tip: "可能失败、变慢或丢精度的转换应改为 explicit 或普通方法。"
  },
  {
    w: "in", ipa: "/\u026an/", cn: "因", c: "参数与泛型", l: 2,
    summary: "表示只读引用参数、foreach 来源或泛型逆变。",
    detail: "in 有多个上下文：foreach 中连接变量与序列；参数前表示按只读引用传递；泛型接口或委托类型参数前表示逆变。具体含义由语法位置决定。",
    code: "double Length(in Point point)\n    => Math.Sqrt(point.X * point.X + point.Y * point.Y);",
    tip: "小型结构体使用 in 不一定更快，性能优化应以测量结果为依据。"
  },
  {
    w: "int", ipa: "/\u026ant/", cn: "因特", c: "基础类型", l: 1,
    summary: "声明 32 位有符号整数。",
    detail: "int 是 System.Int32 的别名，范围约为负 21 亿到正 21 亿，是 C# 整数字面量和一般计数的常用类型。",
    code: "int count = items.Count;\nint next = count + 1;",
    tip: "集合索引通常使用 int；超大计数或文件长度可能需要 long。"
  },
  {
    w: "interface", ipa: "/\u02c8\u026ant\u0259rfe\u026as/", cn: "因特费斯", c: "面向对象", l: 1,
    summary: "声明类型必须遵守的一组契约。",
    detail: "接口描述成员能力，类和结构体可以实现多个接口。接口成员可包含方法、属性、事件和索引器，现代 C# 也支持某些默认实现与静态抽象成员。",
    code: "interface IPrintable\n{\n    void Print();\n}",
    tip: "接口应围绕使用者需要的小能力设计，避免庞大的万能接口。"
  },
  {
    w: "internal", ipa: "/\u026an\u02c8t\u025c\u02d0rn\u0259l/", cn: "因特尔诺", c: "访问控制", l: 2,
    summary: "把类型或成员的可访问范围限制在当前程序集。",
    detail: "internal 允许同一编译程序集中的代码访问，其他程序集默认不可见。它很适合隐藏库的实现细节，同时让内部模块协作。",
    code: "internal sealed class CacheStore { }",
    tip: "程序集边界不等于命名空间边界；同命名空间的另一个程序集也不能访问。"
  },
  {
    w: "is", ipa: "/\u026az/", cn: "伊兹", c: "类型系统", l: 1,
    summary: "测试表达式是否匹配类型、常量或其他模式。",
    detail: "is 返回布尔结果，并支持模式匹配。写成 value is string text 时，成功分支中会得到已正确转换的 text 变量，无需再次强制转换。",
    code: "if (value is int number && number > 0)\n    Use(number);",
    tip: "is null 不会调用重载的 ==，是可靠的空值检查方式。"
  },
  {
    w: "lock", ipa: "/l\u0251\u02d0k/", cn: "洛克", c: "并发", l: 2,
    summary: "保证同一时刻只有一个线程进入临界区。",
    detail: "lock 获取指定同步对象的互斥锁，并通过 try/finally 语义确保退出时释放。用于保护多个线程共享的可变状态。",
    code: "private readonly object gate = new();\nlock (gate)\n{\n    balance += amount;\n}",
    tip: "不要锁 this、字符串或公开对象；外部代码可能锁住同一对象造成死锁。"
  },
  {
    w: "long", ipa: "/l\u0254\u02d0\u014b/", cn: "朗", c: "基础类型", l: 1,
    summary: "声明 64 位有符号整数。",
    detail: "long 是 System.Int64 的别名，适合大范围计数、时间戳和文件尺寸。超出 int 范围的整数字面量通常需要 L 后缀。",
    code: "long bytes = 5_000_000_000L;",
    tip: "优先使用大写 L，避免小写 l 与数字 1 混淆。"
  },
  {
    w: "namespace", ipa: "/\u02c8ne\u026amspe\u026as/", cn: "内姆斯佩斯", c: "代码组织", l: 1,
    summary: "组织类型并避免名称冲突。",
    detail: "命名空间为类、接口等类型提供逻辑名称范围，可使用块式或文件范围语法。它不决定程序集或文件夹边界，但常与目录结构保持一致。",
    code: "namespace MyApp.Services;\n\npublic class EmailSender { }",
    tip: "命名空间不是类型，不能 new，也不能使用访问修饰符直接修饰。"
  },
  {
    w: "new", ipa: "/nu\u02d0/", cn: "纽", c: "对象与成员", l: 1,
    summary: "创建对象/数组，或显式隐藏继承成员。",
    detail: "最常见用法是调用构造函数并创建实例。作为成员修饰符时，new 表明有意隐藏基类同名成员，消除编译器警告；这不等于多态重写。",
    code: "var person = new Person(\"Ada\");\nint[] scores = new int[3];",
    tip: "new 隐藏与 override 重写行为不同；通过基类引用调用时结果也不同。"
  },
  {
    w: "null", ipa: "/n\u028cl/", cn: "纳尔", c: "字面量", l: 1,
    summary: "表示没有对象引用或没有可空值。",
    detail: "null 可赋给引用类型、可空值类型和某些指针类型。启用可空引用类型分析后，string 与 string? 会表达不同的空值意图，但运行时引用表示并未因此改变。",
    code: "string? name = null;\nif (name is null) return;",
    tip: "不要用 null 表示多个不同业务状态；必要时使用结果类型或明确状态对象。"
  },
  {
    w: "object", ipa: "/\u02c8\u0251\u02d0bd\u0292ekt/", cn: "奥布杰克特", c: "基础类型", l: 1,
    summary: "所有 C# 类型最终共同的基类型别名。",
    detail: "object 是 System.Object 的别名。任何值都可转换为 object；值类型转换时会装箱。它提供 ToString、Equals、GetHashCode 和 GetType 等基础成员。",
    code: "object value = 42; // boxing\nConsole.WriteLine(value);",
    tip: "大量装箱会产生分配；需要类型安全和性能时优先泛型。"
  },
  {
    w: "operator", ipa: "/\u02c8\u0251\u02d0p\u0259re\u026at\u0259r/", cn: "奥珀瑞特", c: "成员与修饰符", l: 3,
    summary: "为自定义类型声明运算符行为。",
    detail: "operator 可重载 +、-、== 等运算符，让自定义值类型获得自然语法。运算符方法必须是 public static，并满足各运算符规定的参数数量。",
    code: "public static Vector operator +(Vector a, Vector b)\n    => new(a.X + b.X, a.Y + b.Y);",
    tip: "重载应保持直觉和代数一致性；不要让 + 执行令人意外的副作用。"
  },
  {
    w: "out", ipa: "/a\u028at/", cn: "奥特", c: "参数与泛型", l: 2,
    summary: "表示方法必须赋值的输出引用参数，或泛型协变。",
    detail: "out 参数由被调用方法在返回前赋值，调用方不必先初始化，常见于 TryParse 模式。在泛型类型参数位置，out 表示协变。",
    code: "if (int.TryParse(text, out int number))\n    Use(number);",
    tip: "返回信息越来越多时，元组或结果对象往往比多个 out 参数更清晰。"
  },
  {
    w: "override", ipa: "/\u02cco\u028av\u0259r\u02c8ra\u026ad/", cn: "欧沃赖德", c: "面向对象", l: 2,
    summary: "为继承的 virtual 或 abstract 成员提供新实现。",
    detail: "override 保持同一虚成员槽，使通过基类引用的调用也能在运行时分派到派生实现。签名和可访问性需符合基类契约。",
    code: "public override string ToString()\n    => $\"{X}, {Y}\";",
    tip: "不要用 new 代替 override；new 只是按静态类型隐藏成员。"
  },
  {
    w: "params", ipa: "/p\u00e6r\u0259mz/", cn: "派拉姆斯", c: "参数与泛型", l: 2,
    summary: "允许调用者传入数量可变的参数。",
    detail: "params 修饰最后一个参数。调用者既可逐个传参，也可传入兼容集合/数组；编译器会在需要时构造参数集合。",
    code: "int Sum(params int[] values)\n    => values.Sum();\n\nSum(1, 2, 3);",
    tip: "频繁调用时留意隐式数组分配；性能敏感路径可提供其他重载。"
  },
  {
    w: "partial", ipa: "/\u02c8p\u0251\u02d0r\u0283\u0259l/", cn: "帕肖", c: "代码组织", l: 2,
    summary: "把一个类型或成员的声明分散到多个位置。",
    detail: "partial 常用于代码生成场景，让生成代码与手写代码属于同一类型但位于不同文件。编译后它们会合并为一个类型。",
    code: "public partial class MainForm\n{\n    partial void OnLoaded();\n}",
    tip: "不要用 partial 掩盖职责过多的巨型类；它只是物理拆分，不是设计拆分。"
  },
  {
    w: "private", ipa: "/\u02c8pra\u026av\u0259t/", cn: "普赖维特", c: "访问控制", l: 1,
    summary: "只允许包含它的类型内部访问成员。",
    detail: "private 是最严格的常用成员访问级别，用于隐藏实现细节和维护不变量。嵌套类型可以访问其包含类型的私有成员，反之亦可。",
    code: "private int balance;\nprivate void Recalculate() { }",
    tip: "默认先用最小可见性，再按真实协作需要放宽访问范围。"
  },
  {
    w: "protected", ipa: "/pr\u0259\u02c8tekt\u026ad/", cn: "普若泰克提德", c: "访问控制", l: 2,
    summary: "允许当前类型及其派生类型访问成员。",
    detail: "protected 为继承者开放扩展点，但不向普通外部调用者公开。派生类访问时还受实例静态类型等规则约束。",
    code: "protected virtual void OnChanged() { }",
    tip: "protected 字段会扩大可变状态的影响范围；通常优先 protected 方法或属性。"
  },
  {
    w: "public", ipa: "/\u02c8p\u028cbl\u026ak/", cn: "帕布利克", c: "访问控制", l: 1,
    summary: "允许任何可引用该类型的代码访问。",
    detail: "public 是最宽的访问级别，常用于库和应用模块的稳定 API。公共成员会形成长期契约，应清晰、可维护并谨慎变更。",
    code: "public string Name { get; init; }",
    tip: "能编译不代表应公开；不必要的 public 会增加兼容性和维护成本。"
  },
  {
    w: "readonly", ipa: "/\u02c8ri\u02d0d\u02cco\u028anli/", cn: "瑞德欧恩利", c: "成员与修饰符", l: 2,
    summary: "限制字段赋值，或声明只读结构体/成员。",
    detail: "readonly 字段只能在声明处或构造函数中赋值；引用字段本身不能改指向，但引用对象仍可能可变。它也可修饰 struct 和结构体成员以减少防御性复制并表达只读意图。",
    code: "private readonly HttpClient client = new();",
    tip: "readonly 不等于深度不可变；集合字段仍可能被 Add 或 Remove。"
  },
  {
    w: "record", ipa: "/\u02c8rek\u0259rd/", cn: "瑞科德", c: "类型系统", l: 2,
    summary: "声明以数据和值相等性为核心的类型。",
    detail: "record 默认生成基于内容的相等性、友好的 ToString 和 with 复制支持。record class 是引用类型，record struct 是值类型，适合不可变数据模型和消息对象。",
    code: "public record User(string Name, int Age);\nvar older = user with { Age = 31 };",
    tip: "记录中的引用成员仍按其自身相等性比较，集合通常不是逐元素值相等。"
  },
  {
    w: "ref", ipa: "/ref/", cn: "瑞夫", c: "参数与泛型", l: 2,
    summary: "按引用传递变量，或声明引用返回/引用局部变量。",
    detail: "ref 让方法直接操作调用方的存储位置。调用前变量必须已初始化，调用处也必须写 ref。它还可用于 ref return、ref local 和 ref struct 等高性能场景。",
    code: "void Increment(ref int value) => value++;\nint count = 0;\nIncrement(ref count);",
    tip: "ref 会增加别名和状态推理成本，普通返回值能表达时通常更简单。"
  },
  {
    w: "return", ipa: "/r\u026a\u02c8t\u025c\u02d0rn/", cn: "瑞-特恩", c: "流程控制", l: 1,
    summary: "结束当前方法并可把值返回给调用方。",
    detail: "return 立即离开方法；非 void 方法必须返回与声明类型兼容的表达式。局部函数、Lambda 和迭代器中的具体规则会根据返回类型变化。",
    code: "int Square(int value)\n{\n    return value * value;\n}",
    tip: "适当的提前 return 能减少嵌套，但过多出口也可能让清理逻辑分散。"
  },
  {
    w: "sealed", ipa: "/si\u02d0ld/", cn: "西尔德", c: "面向对象", l: 2,
    summary: "阻止类被继承，或阻止已重写成员再次被重写。",
    detail: "sealed class 不能作为基类。sealed override 可终止某个虚成员的进一步重写，同时类的其他虚成员仍可扩展。",
    code: "public sealed class TokenCache { }",
    tip: "是否 sealed 应基于扩展契约，而不只是为了微小的潜在优化。"
  },
  {
    w: "set", ipa: "/set/", cn: "塞特", c: "成员与修饰符", l: 1,
    summary: "定义属性或索引器写入值的访问器。",
    detail: "set 在赋值属性时执行，新值通过隐式参数 value 获得。可添加验证、规范化或通知逻辑，也可设置更严格的访问级别。",
    code: "public int Age\n{\n    get => age;\n    set => age = Math.Max(0, value);\n}",
    tip: "setter 中隐藏昂贵操作或 I/O 会让普通赋值产生意外成本。"
  },
  {
    w: "short", ipa: "/\u0283\u0254\u02d0rt/", cn: "肖特", c: "基础类型", l: 1,
    summary: "声明 16 位有符号整数。",
    detail: "short 是 System.Int16 的别名，范围 -32768 到 32767，常见于文件格式、协议和节省大量数组存储。一般业务计数仍多用 int。",
    code: "short temperature = -12;",
    tip: "short 运算常提升为 int，赋回 short 时可能需要显式转换。"
  },
  {
    w: "sizeof", ipa: "/sa\u026az \u028cv/", cn: "赛兹-奥夫", c: "数值与内存", l: 3,
    summary: "取得非托管类型以字节计的大小。",
    detail: "sizeof 可直接用于内置非托管类型；用于其他非托管类型时通常需要 unsafe 上下文。结果是 int，常用于互操作和底层内存计算。",
    code: "int bytes = sizeof(long); // 8",
    tip: "引用类型变量的大小不是对象在托管堆中的完整占用。"
  },
  {
    w: "stackalloc", ipa: "/st\u00e6k \u02c8\u00e6l\u0259k/", cn: "斯泰克-艾洛克", c: "数值与内存", l: 3,
    summary: "在当前栈帧上分配一段连续内存。",
    detail: "stackalloc 常与 Span<T> 配合，避免小型临时缓冲区的堆分配。内存在方法返回时自动失效，大小必须谨慎控制。",
    code: "Span<int> values = stackalloc int[4] { 1, 2, 3, 4 };",
    tip: "不要用用户输入直接决定大型 stackalloc 大小，可能造成栈溢出。"
  },
  {
    w: "static", ipa: "/\u02c8st\u00e6t\u026ak/", cn: "斯泰提克", c: "成员与修饰符", l: 1,
    summary: "让成员或类型属于类型本身而非某个实例。",
    detail: "static 成员通过类型名访问，不能直接使用实例成员或 this。静态类只能包含静态成员且不能实例化；静态局部函数不能捕获外部局部变量。",
    code: "public static int Add(int a, int b) => a + b;",
    tip: "可变静态状态相当于全局状态，会增加并发和测试难度。"
  },
  {
    w: "string", ipa: "/str\u026a\u014b/", cn: "斯吹英", c: "基础类型", l: 1,
    summary: "声明不可变的 UTF-16 文本引用。",
    detail: "string 是 System.String 的别名。字符串对象不可变，拼接或替换会产生新字符串；编译器和运行时会对字面量等情况进行优化。",
    code: "string greeting = $\"Hello, {name}!\";",
    tip: "循环中大量拼接应考虑 StringBuilder，避免创建许多中间字符串。"
  },
  {
    w: "struct", ipa: "/str\u028ckt/", cn: "斯特拉克特", c: "类型系统", l: 1,
    summary: "声明具有值语义的结构体类型。",
    detail: "结构体变量直接包含其数据，赋值通常复制整个值。它可实现接口但不能继承其他类或结构体，适合小型、逻辑上单一且最好不可变的数据。",
    code: "public readonly struct Point\n{\n    public Point(int x, int y) => (X, Y) = (x, y);\n    public int X { get; }\n    public int Y { get; }\n}",
    tip: "大型或频繁变化的 struct 会产生复制成本和可变值语义陷阱。"
  },
  {
    w: "switch", ipa: "/sw\u026at\u0283/", cn: "斯维奇", c: "流程控制", l: 1,
    summary: "按值或模式从多个分支中选择一个。",
    detail: "switch 语句执行匹配分支；switch 表达式直接产生值。模式匹配让它能处理类型、属性、范围和组合条件，分支按顺序匹配。",
    code: "string label = score switch\n{\n    >= 90 => \"A\",\n    >= 60 => \"Pass\",\n    _ => \"Retry\"\n};",
    tip: "switch 表达式若没有匹配分支，运行时可能抛出匹配失败异常。"
  },
  {
    w: "this", ipa: "/\u00f0\u026as/", cn: "泽斯", c: "对象与成员", l: 1,
    summary: "引用当前实例，或声明扩展方法的首个参数。",
    detail: "实例成员中 this 代表当前对象，可解决字段与参数同名问题、传递当前实例或调用当前类型的其他构造函数。在扩展方法首参数前，this 指定被扩展类型。",
    code: "public Person(string name)\n{\n    this.name = name;\n}",
    tip: "静态成员没有当前实例，因此不能使用 this。"
  },
  {
    w: "throw", ipa: "/\u03b8ro\u028a/", cn: "思柔", c: "异常处理", l: 1,
    summary: "抛出异常，或在 catch 中重新抛出当前异常。",
    detail: "throw new ... 创建并抛出异常；catch 中单独写 throw; 会保留原始堆栈重新抛出。throw 也可作为表达式用于参数验证等紧凑写法。",
    code: "if (name is null)\n    throw new ArgumentNullException(nameof(name));",
    tip: "重新抛出时优先 throw;，写 throw ex; 会重置可见堆栈位置。"
  },
  {
    w: "true", ipa: "/tru\u02d0/", cn: "楚", c: "字面量", l: 1,
    summary: "布尔类型的真值字面量。",
    detail: "true 是 bool 的两个值之一，表示条件成立。逻辑与、或、非等运算都会产生布尔结果供 if、while 等语句使用。",
    code: "bool enabled = true;",
    tip: "复杂业务中的真/假可能信息不足，可用枚举表达多状态。"
  },
  {
    w: "try", ipa: "/tra\u026a/", cn: "踹", c: "异常处理", l: 1,
    summary: "标记需要异常处理或清理保护的代码块。",
    detail: "try 后必须跟至少一个 catch 或 finally。try 内抛出的异常会按顺序寻找匹配 catch，随后执行 finally；它为异常边界提供结构。",
    code: "try\n{\n    ParseFile(path);\n}\ncatch (FormatException ex)\n{\n    Report(ex);\n}",
    tip: "try 块范围应围绕真实失败边界，过大会让异常来源和恢复策略模糊。"
  },
  {
    w: "typeof", ipa: "/ta\u026ap \u028cv/", cn: "泰普-奥夫", c: "类型系统", l: 1,
    summary: "取得编译期已知类型对应的 System.Type 对象。",
    detail: "typeof(T) 不需要创建 T 的实例，常用于反射、特性和泛型元数据。开放泛型可写 typeof(Dictionary<,>)。",
    code: "Type type = typeof(List<string>);\nConsole.WriteLine(type.Name);",
    tip: "获取对象的运行时类型使用 instance.GetType()，不是 typeof(instance)。"
  },
  {
    w: "uint", ipa: "/ju\u02d0 \u026ant/", cn: "尤-因特", c: "基础类型", l: 2,
    summary: "声明 32 位无符号整数。",
    detail: "uint 是 System.UInt32 的别名，范围从 0 到约 42 亿。常用于位操作、协议和与原生 API 对齐，但与常用 int 混算时需要注意转换。",
    code: "uint mask = 0xFF00FF00u;",
    tip: "业务计数即使不能为负也常用 int，避免与集合 API 的 int 索引摩擦。"
  },
  {
    w: "ulong", ipa: "/ju\u02d0 l\u0254\u02d0\u014b/", cn: "尤-朗", c: "基础类型", l: 2,
    summary: "声明 64 位无符号整数。",
    detail: "ulong 是 System.UInt64 的别名，表示非常大的非负整数。字面量可用 UL 后缀，常见于哈希、位图和底层协议。",
    code: "ulong flags = 1UL << 63;",
    tip: "与 long 互转可能溢出；边界处应使用 checked 或显式验证。"
  },
  {
    w: "unchecked", ipa: "/\u028cn\u02c8t\u0283ekt/", cn: "安-切克特", c: "数值与内存", l: 3,
    summary: "允许整数溢出按截断后的位模式继续。",
    detail: "unchecked 关闭特定整型运算和转换的溢出检查。超出范围的高位会被丢弃，结果按目标类型位宽回绕，常用于哈希和底层位算法。",
    code: "int wrapped = unchecked(int.MaxValue + 1);",
    tip: "业务金额或计数通常不应静默回绕；不要为绕过异常而随意使用。"
  },
  {
    w: "unsafe", ipa: "/\u028cn\u02c8se\u026af/", cn: "安-塞夫", c: "数值与内存", l: 3,
    summary: "允许使用指针和绕过部分托管安全检查的代码。",
    detail: "unsafe 可修饰类型、成员或代码块，使其能声明指针、使用 sizeof 某些类型和执行底层内存操作。项目必须允许不安全代码。",
    code: "unsafe\n{\n    int value = 7;\n    int* p = &value;\n}",
    tip: "unsafe 不等于错误，但会把内存安全责任交给开发者，应缩小作用域并严格测试。"
  },
  {
    w: "using", ipa: "/\u02c8ju\u02d0z\u026a\u014b/", cn: "尤-辛", c: "资源与组织", l: 1,
    summary: "导入命名空间/别名，或确保释放资源。",
    detail: "文件顶部 using 可简化类型名或定义别名；using 语句与 using 声明会在作用域结束时调用 IDisposable.Dispose。两种含义由语法位置区分。",
    code: "using var stream = File.OpenRead(path);\n// leaving scope calls Dispose",
    tip: "需要异步释放 IAsyncDisposable 时使用 await using。"
  },
  {
    w: "var", ipa: "/v\u0251\u02d0r/", cn: "瓦尔", c: "类型系统", l: 1,
    summary: "让编译器从初始化表达式推断局部变量类型。",
    detail: "var 仍是静态强类型，编译时会确定确切类型，不等于 dynamic。它只能用于有初始化器的局部变量等位置，不能把变量变成可随意更换类型的容器。",
    code: "var names = new List<string>(); // List<string>",
    tip: "当右侧无法清楚说明类型时，显式类型可能更利于阅读。"
  },
  {
    w: "virtual", ipa: "/\u02c8v\u025c\u02d0rt\u0283u\u0259l/", cn: "沃丘尔", c: "面向对象", l: 2,
    summary: "允许派生类用 override 替换成员实现。",
    detail: "virtual 成员提供默认实现并参与运行时多态。通过基类引用调用时，运行时会选择实际对象类型上最具体的 override 实现。",
    code: "public virtual decimal CalculatePrice()\n    => BasePrice;",
    tip: "构造函数中调用 virtual 成员可能触达尚未初始化的派生状态，应避免。"
  },
  {
    w: "void", ipa: "/v\u0254\u026ad/", cn: "沃伊德", c: "基础类型", l: 1,
    summary: "表示方法不向调用方返回值。",
    detail: "void 用作方法返回类型，说明调用只产生行为而没有结果值。方法仍可写不带表达式的 return; 提前结束。",
    code: "void Log(string message)\n{\n    Console.WriteLine(message);\n}",
    tip: "异步方法通常返回 Task 而不是 void，事件处理器是主要例外。"
  },
  {
    w: "volatile", ipa: "/\u02c8v\u0251\u02d0l\u0259t\u0259l/", cn: "沃拉泰尔", c: "并发", l: 3,
    summary: "要求字段读写采用特定内存可见性语义。",
    detail: "volatile 防止编译器和处理器对该字段的某些访问重排，并让线程更及时观察更新。它不让复合操作（如 ++）变成原子操作，也不能替代完整同步。",
    code: "private volatile bool stopping;",
    tip: "并发状态优先考虑 lock、Interlocked、并发集合或 CancellationToken。"
  },
  {
    w: "while", ipa: "/wa\u026al/", cn: "外尔", c: "流程控制", l: 1,
    summary: "在布尔条件为 true 时重复执行循环体。",
    detail: "while 先判断条件再执行，因此可能一次也不运行。适合迭代次数未知、由状态或输入决定是否继续的场景。",
    code: "while (queue.Count > 0)\n{\n    Process(queue.Dequeue());\n}",
    tip: "确保循环内最终能改变条件或退出，否则会形成意外的无限循环。"
  },
  {
    w: "yield", ipa: "/ji\u02d0ld/", cn: "伊尔德", c: "迭代器", l: 2,
    summary: "在迭代器中逐个产生值或结束序列。",
    detail: "yield return 延迟返回序列中的一个元素并保存执行位置；下一次迭代时从该位置继续。yield break 立即结束迭代器。编译器会生成状态机。",
    code: "IEnumerable<int> CountTo(int max)\n{\n    for (int i = 1; i <= max; i++)\n        yield return i;\n}",
    tip: "迭代器通常延迟执行；异常可能在枚举时而不是调用方法时出现。"
  },
  {
    w: "init", ipa: "/\u026a\u02c8n\u026at/", cn: "伊-尼特", c: "成员与修饰符", l: 2,
    summary: "只允许属性在对象初始化阶段赋值。",
    detail: "init 访问器类似 set，但赋值限定在对象初始化器、构造过程或 with 表达式等初始化阶段。它有助于创建初始化后不可变的对象。",
    code: "public string Name { get; init; } = \"\";",
    tip: "init 只限制属性入口；属性引用的可变对象仍可在之后修改。"
  },
  {
    w: "required", ipa: "/r\u026a\u02c8kwa\u026ard/", cn: "瑞-夸尔德", c: "成员与修饰符", l: 2,
    summary: "要求创建对象时初始化指定字段或属性。",
    detail: "required 把初始化责任加入类型契约。构造对象的代码必须通过对象初始化器或满足相关构造规则给这些成员赋值，编译器会检查遗漏。",
    code: "public required string Id { get; init; }",
    tip: "required 保证被赋值，不自动保证值非 null 或满足业务验证。"
  },
  {
    w: "dynamic", ipa: "/da\u026a\u02c8n\u00e6m\u026ak/", cn: "戴-纳米克", c: "类型系统", l: 2,
    summary: "把成员绑定和类型检查推迟到运行时。",
    detail: "dynamic 变量可在编译时调用任意成员，运行时绑定器再根据实际值解析。它适合 COM、动态语言互操作等边界，但会失去编译期检查和部分工具支持。",
    code: "dynamic value = GetExternalObject();\nvalue.Run();",
    tip: "dynamic 错误会晚到运行时；应把动态边界封装得尽可能小。"
  },
  {
    w: "nameof", ipa: "/ne\u026am \u028cv/", cn: "内姆-奥夫", c: "代码组织", l: 1,
    summary: "在编译期取得符号名称字符串。",
    detail: "nameof 不执行表达式，只返回变量、类型或成员的简单名称，重构工具会同步更新。常用于参数异常、属性通知和日志。",
    code: "if (value is null)\n    throw new ArgumentNullException(nameof(value));",
    tip: "nameof(Person.Name) 返回 Name，而不是完整限定名。"
  },
  {
    w: "when", ipa: "/wen/", cn: "温", c: "模式与异常", l: 2,
    summary: "为 case 或 catch 添加额外条件筛选。",
    detail: "when 是上下文关键字。case 模式后的 when 称为守卫；catch 后的 when 称为异常筛选器，只有条件为 true 才进入对应处理块。",
    code: "catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)\n{\n    return null;\n}",
    tip: "异常筛选器在栈展开前计算，适合精确选择处理范围。"
  },
  {
    w: "where", ipa: "/wer/", cn: "外尔", c: "参数与泛型", l: 2,
    summary: "声明泛型约束，或在查询表达式中过滤元素。",
    detail: "泛型声明中的 where 约束类型参数必须是类、结构体、实现接口、具有构造函数等；LINQ 查询语法中的 where 则根据布尔条件筛选元素。",
    code: "T Create<T>() where T : class, new()\n    => new T();",
    tip: "约束让泛型方法内部能安全使用对应能力，而不需要运行时强制转换。"
  },
  {
    w: "select", ipa: "/s\u026a\u02c8lekt/", cn: "瑟-莱克特", c: "LINQ 查询", l: 2,
    summary: "在查询表达式中投影每个元素。",
    detail: "select 是 LINQ 查询语法的上下文关键字，用于决定结果序列中每个元素的形状，可返回原对象、某个属性、匿名类型或计算结果。",
    code: "var names = from user in users\n            select user.Name;",
    tip: "select 通常对应方法语法的 Select(...)；它转换元素而不是过滤元素。"
  },
  {
    w: "from", ipa: "/fr\u028cm/", cn: "弗拉姆", c: "LINQ 查询", l: 2,
    summary: "开始查询表达式并引入范围变量。",
    detail: "from 是查询语法的入口，指定数据源并为当前元素命名。多个 from 可展开嵌套序列，类似方法语法中的 SelectMany。",
    code: "var adults = from user in users\n             where user.Age >= 18\n             select user;",
    tip: "查询通常延迟执行；定义查询不一定立刻枚举数据源。"
  },
  {
    w: "group", ipa: "/\u0261ru\u02d0p/", cn: "格鲁普", c: "LINQ 查询", l: 2,
    summary: "在查询表达式中按键对元素分组。",
    detail: "group element by key 产生分组序列，每个分组拥有 Key 并可枚举其中元素。可配合 into 继续对分组结果查询。",
    code: "var byDept = from user in users\n             group user by user.Department;",
    tip: "group by 与 select 不同，结果元素是分组而不是单个原元素。"
  },
  {
    w: "orderby", ipa: "/\u02c8\u0254\u02d0rd\u0259r ba\u026a/", cn: "奥德尔-拜", c: "LINQ 查询", l: 2,
    summary: "在查询表达式中按一个或多个键排序。",
    detail: "orderby 默认升序，可加 ascending 或 descending，并用逗号添加后续排序键。它对应 OrderBy/ThenBy 系列方法。",
    code: "var sorted = from user in users\n             orderby user.Age descending, user.Name\n             select user;",
    tip: "排序通常需要缓存和比较整个序列，不适合误当成常数成本操作。"
  },
  {
    w: "sbyte", ipa: "/es ba\u026at/", cn: "艾斯-拜特", c: "基础类型", l: 2,
    summary: "声明 -128 到 127 的 8 位有符号整数。",
    detail: "sbyte 是 System.SByte 的 C# 别名，占 8 位。它主要用于与二进制格式、原生接口或明确使用有符号字节的数据协议交互，普通计数通常仍使用 int。",
    code: "sbyte offset = -12;\nsbyte max = sbyte.MaxValue;",
    tip: "byte 是 0 到 255 的无符号类型；两个类型的位宽相同，但数值解释不同。"
  },
  {
    w: "ushort", ipa: "/ju\u02d0 \u0283\u0254\u02d0rt/", cn: "尤-肖特", c: "基础类型", l: 2,
    summary: "声明 0 到 65535 的 16 位无符号整数。",
    detail: "ushort 是 System.UInt16 的 C# 别名，常用于协议字段、颜色通道、文件格式和原生互操作。算术运算通常会提升为 int，因此结果赋回 ushort 时可能需要检查范围。",
    code: "ushort port = 8080;\nushort max = ushort.MaxValue;",
    tip: "即使业务值不能为负，一般业务计数仍常用 int，以减少与常用 API 的转换。"
  },
  {
    w: "add", ipa: "/\u00e6d/", cn: "艾德", c: "委托与事件", l: 3,
    summary: "在自定义事件中定义订阅访问器。",
    detail: "add 是事件访问器的上下文关键字。当外部代码执行 += 时，add 块被调用，待订阅的委托可通过隐式参数 value 取得。它适合需要自定义存储、转发或线程安全策略的事件。",
    code: "public event EventHandler Changed\n{\n    add { handlers += value; }\n    remove { handlers -= value; }\n}",
    tip: "普通事件通常不需要自定义 add/remove；编译器生成的事件存储更简单。"
  },
  {
    w: "remove", ipa: "/r\u026a\u02c8mu\u02d0v/", cn: "瑞-穆夫", c: "委托与事件", l: 3,
    summary: "在自定义事件中定义取消订阅访问器。",
    detail: "remove 与 add 配对。当外部代码执行 -= 时，remove 块接收隐式参数 value，并负责从实际事件存储或代理目标中移除对应委托。",
    code: "public event EventHandler Changed\n{\n    add { handlers += value; }\n    remove { handlers -= value; }\n}",
    tip: "自定义 remove 必须与 add 使用一致的存储策略，否则订阅可能无法真正解除。"
  },
  {
    w: "value", ipa: "/\u02c8v\u00e6lju\u02d0/", cn: "瓦留", c: "成员与修饰符", l: 2,
    summary: "表示正在写入属性、索引器或事件访问器的隐式值。",
    detail: "value 是 set、init、add 和 remove 访问器中的隐式参数。在属性访问器里它的类型与属性相同；在事件访问器里则是事件的委托类型。",
    code: "public int Age\n{\n    get => age;\n    set => age = Math.Max(0, value);\n}",
    tip: "value 只在相应访问器上下文具有特殊含义，其他位置仍可作为普通标识符。"
  },
  {
    w: "allows", ipa: "/\u0259\u02c8la\u028az/", cn: "额-劳兹", c: "参数与泛型", l: 3,
    summary: "在泛型反约束中允许 ref struct 类型实参。",
    detail: "allows 用于泛型反约束，例如 allows ref struct。它告诉编译器类型参数可能是仅限栈的类型，因此泛型实现必须遵守 ref struct 的逃逸、装箱和生命周期限制。",
    code: "void Inspect<T>(T value)\n    where T : allows ref struct\n{\n    // T may be a ref struct\n}",
    tip: "allows 不是要求 T 必须为 ref struct，而是要求实现能够安全接纳这种可能性。"
  },
  {
    w: "and", ipa: "/\u00e6nd/", cn: "安德", c: "模式匹配", l: 2,
    summary: "组合两个都必须成立的模式。",
    detail: "and 是模式组合器，只在模式匹配语境中连接两个模式。输入必须同时满足左右模式，常用于表达数值区间或多个结构条件。",
    code: "if (score is >= 60 and <= 100)\n    Console.WriteLine(\"valid\");",
    tip: "模式中的 and 不等于布尔运算符 &&；两者处于不同语法层级。"
  },
  {
    w: "or", ipa: "/\u0254\u02d0r/", cn: "奥尔", c: "模式匹配", l: 2,
    summary: "组合任意一个成立即可的模式。",
    detail: "or 是模式组合器，当输入匹配左右任一模式时成功。它适合把多个常量、类型或关系模式合并为一个可读条件。",
    code: "bool IsWeekend(DayOfWeek day)\n    => day is DayOfWeek.Saturday or DayOfWeek.Sunday;",
    tip: "or 两侧声明变量会受到确定赋值限制，因为不保证两个分支都产生同一变量。"
  },
  {
    w: "not", ipa: "/n\u0251\u02d0t/", cn: "纳特", c: "模式匹配", l: 2,
    summary: "否定紧随其后的模式。",
    detail: "not 是一元模式组合器，输入不匹配内部模式时成功。常见写法是 is not null，也可与 and、or 组合表达排除范围。",
    code: "if (result is not null)\n    Use(result);",
    tip: "复杂组合应使用括号明确优先级，避免把模式 not 与布尔 ! 混淆。"
  },
  {
    w: "ascending", ipa: "/\u0259\u02c8send\u026a\u014b/", cn: "额-森丁", c: "LINQ 查询", l: 2,
    summary: "指定查询排序键按升序排列。",
    detail: "ascending 是 orderby 子句中的上下文关键字，表示从小到大排序。它是默认方向，因此省略时效果相同，但显式写出可与后续 descending 键形成清楚对照。",
    code: "var result = from item in items\n             orderby item.Name ascending\n             select item;",
    tip: "字符串升序的具体顺序取决于使用的比较器和区域性规则。"
  },
  {
    w: "descending", ipa: "/d\u026a\u02c8send\u026a\u014b/", cn: "迪-森丁", c: "LINQ 查询", l: 2,
    summary: "指定查询排序键按降序排列。",
    detail: "descending 放在 orderby 的排序键后，使较大的值排在前面。多个排序键可以分别选择 ascending 或 descending。",
    code: "var result = from item in items\n             orderby item.Score descending\n             select item;",
    tip: "降序只改变比较方向，不会让延迟执行的查询立即运行。"
  },
  {
    w: "by", ipa: "/ba\u026a/", cn: "拜", c: "LINQ 查询", l: 2,
    summary: "在 group 查询子句中引出分组键。",
    detail: "by 位于 group element by key 结构中，左侧决定每组包含什么元素，右侧决定用什么键建立分组。结果是具有 Key 的分组序列。",
    code: "var groups = from user in users\n             group user.Name by user.Department;",
    tip: "by 只负责分组键，不等同于 orderby 中表示排序依据的自然语言含义。"
  },
  {
    w: "args", ipa: "/\u0251\u02d0r\u0261z/", cn: "阿格兹", c: "代码组织", l: 1,
    summary: "在顶级语句中表示命令行参数的隐式字符串数组。",
    detail: "使用顶级语句时，编译器提供名为 args 的 string[] 变量，其内容与传统 Main(string[] args) 参数相同。它只在顶级语句的特定上下文中具有预定义含义。",
    code: "Console.WriteLine($\"收到 {args.Length} 个参数\");",
    tip: "args 不是所有方法中的全局变量；普通方法需要显式接收或传递参数数组。"
  },
  {
    w: "equals", ipa: "/\u02c8i\u02d0kw\u0259lz/", cn: "伊阔兹", c: "LINQ 查询", l: 2,
    summary: "在 join 查询子句中连接左右键。",
    detail: "equals 是查询表达式 join 子句的组成部分，位于左键与右键之间。它表达相等连接，编译器会把查询转换为相应的 Join 或 GroupJoin 调用。",
    code: "var result = from order in orders\n             join user in users\n             on order.UserId equals user.Id\n             select new { order, user };",
    tip: "join 中必须写 equals，不能用 == 代替；左右键的作用域规则也不同。"
  },
  {
    w: "file", ipa: "/fa\u026al/", cn: "法伊尔", c: "访问控制", l: 2,
    summary: "把顶级类型的可见范围限制在当前源文件。",
    detail: "file 是顶级类型的访问修饰符。文件局部类型只能在声明它的源文件中使用，适合源代码生成器或隐藏只服务于单个文件的实现类型。",
    code: "file sealed class ParserState\n{\n    public int Position { get; set; }\n}",
    tip: "file 限制的是源文件范围，比 internal 的程序集范围更窄。"
  },
  {
    w: "global", ipa: "/\u02c8\u0261lo\u028ab\u0259l/", cn: "格楼博", c: "代码组织", l: 2,
    summary: "声明全局 using，或从全局命名空间开始解析名称。",
    detail: "global using 让 using 指令对同一编译单元中的所有源文件生效；global:: 别名限定符则从全局命名空间开始查找，避免局部类型或命名空间遮蔽。",
    code: "global using System.Text;\n\nvar timer = new global::System.Timers.Timer();",
    tip: "global using 的全局范围是当前编译项目，不会自动传播给引用它的其他项目。"
  },
  {
    w: "into", ipa: "/\u02c8\u026antu\u02d0/", cn: "因图", c: "LINQ 查询", l: 2,
    summary: "保存查询中间结果并继续新的查询范围。",
    detail: "into 创建查询延续，把 group、join 或 select 等子句的结果命名为新的范围变量。使用 into 后，之前的范围变量通常不再可直接访问。",
    code: "var result = from user in users\n             group user by user.Department into dept\n             where dept.Count() > 2\n             select dept;",
    tip: "into 在 join ... into 中还可形成分组连接，是实现左外连接的常见基础。"
  },
  {
    w: "join", ipa: "/d\u0292\u0254\u026an/", cn: "卓因", c: "LINQ 查询", l: 2,
    summary: "在查询表达式中按相等键连接两个数据源。",
    detail: "join 通过 on ... equals ... 指定左右键，为外部序列的每个元素匹配内部序列元素。配合 into 可得到分组连接。",
    code: "var result = from order in orders\n             join user in users\n             on order.UserId equals user.Id\n             select (order, user);",
    tip: "普通 join 是内部连接，没有匹配项的元素不会出现在结果中。"
  },
  {
    w: "let", ipa: "/let/", cn: "莱特", c: "LINQ 查询", l: 2,
    summary: "在查询表达式中保存计算得到的临时值。",
    detail: "let 为当前查询范围引入一个新变量，避免重复计算表达式，并让后续 where、orderby 或 select 子句更易读。它不会修改原始元素。",
    code: "var result = from name in names\n             let normalized = name.Trim().ToUpperInvariant()\n             where normalized.Length > 3\n             select normalized;",
    tip: "let 对应查询转换中的投影，复杂对象可能因此形成额外的中间结构。"
  },
  {
    w: "on", ipa: "/\u0251\u02d0n/", cn: "昂", c: "LINQ 查询", l: 2,
    summary: "在 join 查询子句中引出左侧连接键。",
    detail: "on 位于 join 数据源之后，后接外部序列的键表达式，再由 equals 引出内部序列的键表达式。它只在查询 join 语法中具有特殊含义。",
    code: "join product in products\n    on line.ProductId equals product.Id",
    tip: "on 与 equals 两侧的变量作用域不同，交换表达式可能导致编译错误。"
  },
  {
    w: "with", ipa: "/w\u026a\u00f0/", cn: "维兹", c: "类型系统", l: 2,
    summary: "基于现有值创建仅修改部分成员的新值。",
    detail: "with 表达式执行非破坏性复制，常用于 record 和结构体。它先复制原值，再应用对象初始化器中的成员修改，原对象保持不变。",
    code: "var next = user with\n{\n    Name = \"Grace\"\n};",
    tip: "with 通常是浅复制；引用类型成员可能仍与原对象共享同一个实例。"
  },
  {
    w: "extension", ipa: "/\u026ak\u02c8sten\u0283\u0259n/", cn: "伊克斯滕申", c: "成员与修饰符", l: 3,
    summary: "声明以指定接收者为目标的扩展成员块。",
    detail: "extension 是扩展块语法中的上下文关键字。扩展块可把实例或静态扩展成员组织在一起，让调用方以成员语法使用原本不属于目标类型的功能。",
    code: "public static class TextExtensions\n{\n    extension(string text)\n    {\n        public bool IsBlank => string.IsNullOrWhiteSpace(text);\n    }\n}",
    tip: "扩展成员不真正修改原类型；原类型的实例成员通常优先于同名扩展成员。"
  },
  {
    w: "field", ipa: "/fi\u02d0ld/", cn: "菲尔德", c: "成员与修饰符", l: 3,
    summary: "在属性访问器中引用编译器生成的后备字段。",
    detail: "field 是属性访问器特定上下文中的关键字，让半自动属性可以验证或转换值，同时继续使用编译器生成的后备字段，不必手写额外字段。",
    code: "public string Name\n{\n    get;\n    set => field = value.Trim();\n}",
    tip: "如果类型中已有名为 field 的成员，使用此语法时要留意名称含义和编译器诊断。"
  },
  {
    w: "managed", ipa: "/\u02c8m\u00e6n\u026ad\u0292d/", cn: "麦尼杰德", c: "数值与内存", l: 3,
    summary: "标记函数指针采用托管调用约定。",
    detail: "managed 在函数指针类型中表示使用托管调用约定，由 .NET 运行时负责相应的调用语义。它主要面向底层、高性能和互操作代码。",
    code: "unsafe\n{\n    delegate* managed<int, void> callback = &Handle;\n}",
    tip: "普通委托更安全也更常用；函数指针通常只应出现在明确需要的底层边界。"
  },
  {
    w: "unmanaged", ipa: "/\u028cn\u02c8m\u00e6n\u026ad\u0292d/", cn: "安-麦尼杰德", c: "参数与泛型", l: 3,
    summary: "约束类型不含托管引用，或指定非托管函数指针调用约定。",
    detail: "unmanaged 可作为泛型约束，保证类型是可直接按字节处理的非托管类型；也可用于函数指针，表示采用非托管调用约定。",
    code: "int SizeOf<T>() where T : unmanaged\n{\n    unsafe { return sizeof(T); }\n}",
    tip: "unmanaged 约束比 struct 更严格；结构体字段中也不能包含托管引用。"
  },
  {
    w: "nint", ipa: "/en \u026ant/", cn: "恩-因特", c: "基础类型", l: 2,
    summary: "声明大小随进程位数变化的有符号整数。",
    detail: "nint 是本机大小的有符号整数类型，在 32 位进程中为 32 位，在 64 位进程中为 64 位。它适合指针相关计算、句柄和原生互操作。",
    code: "nint offset = 42;\nConsole.WriteLine(nint.Size);",
    tip: "需要跨平台固定数据格式时不要使用 nint，应选择 int 或 long 等固定位宽类型。"
  },
  {
    w: "nuint", ipa: "/en ju\u02d0 \u026ant/", cn: "恩-尤-因特", c: "基础类型", l: 2,
    summary: "声明大小随进程位数变化的无符号整数。",
    detail: "nuint 是本机大小的无符号整数类型，对应 System.UIntPtr 的语言别名语义，常用于内存大小、地址偏移和原生 API。",
    code: "nuint length = 1024;\nConsole.WriteLine(nuint.Size);",
    tip: "nuint 的最大值依赖目标进程位数，持久化或网络传输时应换成固定位宽类型。"
  },
  {
    w: "notnull", ipa: "/n\u0251\u02d0t n\u028cl/", cn: "纳特-纳尔", c: "参数与泛型", l: 2,
    summary: "约束泛型类型参数不能是可空类型。",
    detail: "notnull 泛型约束表达类型参数应为不可空值类型或不可空引用类型。它主要配合可空静态分析，帮助字典键等 API 表达不能接受 null 的契约。",
    code: "class Index<TKey, TValue>\n    where TKey : notnull\n{\n    private readonly Dictionary<TKey, TValue> data = new();\n}",
    tip: "notnull 主要产生编译期可空分析约束，并不会自动为运行时输入添加 null 检查。"
  },
  {
    w: "scoped", ipa: "/sko\u028apt/", cn: "斯寇普特", c: "参数与泛型", l: 3,
    summary: "限制引用变量或参数逃逸出当前安全作用域。",
    detail: "scoped 向编译器声明 ref 或 ref struct 引用不会被保存到更长生命周期的位置。它让 API 能安全处理栈上数据，同时阻止返回、捕获或存储造成悬空引用。",
    code: "void Read(scoped ReadOnlySpan<char> text)\n{\n    Console.WriteLine(text.Length);\n}",
    tip: "scoped 约束的是引用的逃逸范围，不代表引用指向的数据本身不可修改。"
  }
];

window.RESERVED_KEYWORDS = "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while".split(" ");

window.CONTEXTUAL_KEYWORDS = "add allows and ascending args async await by descending dynamic equals extension field file from get global group init into join let managed nameof nint not notnull nuint on or orderby partial record remove required scoped select set unmanaged value var when where with yield".split(" ");

window.KEYWORDS.forEach(item => {
  item.kind = window.RESERVED_KEYWORDS.includes(item.w) ? "保留关键字" : "上下文关键字";
});

window.CATEGORIES = ["全部", ...new Set(window.KEYWORDS.map(item => item.c))];

window.LANGUAGE_BANKS = window.LANGUAGE_BANKS || {};
window.LANGUAGE_BANKS.csharp = {
  id: "csharp",
  name: "C#",
  standard: "C# 完整词汇",
  keywords: window.KEYWORDS,
  reserved: window.RESERVED_KEYWORDS,
  contextual: window.CONTEXTUAL_KEYWORDS
};
