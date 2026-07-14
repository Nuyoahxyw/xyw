(function () {
  "use strict";

  function keyword(w, ipa, cn, c, l, summary, detail, code, tip, speech, kind) {
    return { w, ipa, cn, c, l, summary, detail, code, tip, speech: speech || w, kind: kind || "保留关键字" };
  }

  const words = "alignas alignof and and_eq asm auto bitand bitor bool break case catch char char8_t char16_t char32_t class compl concept const consteval constexpr constinit const_cast continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq".split(" ");
  const contextualWords = "final override module import".split(" ");

  const custom = [
    keyword("alignas", "/\u0259\u02c8la\u026an \u00e6z/", "额赖恩-艾兹", "内存与类型", 2, "为对象或类型指定内存对齐要求。", "alignas 可接受对齐字节值或类型，并把声明实体的对齐提高到指定要求。多个 alignas 会采用最严格的有效要求。", "alignas(32) std::byte buffer[64];", "不能用 alignas 削弱类型天然需要的对齐，也不能使用实现不支持的无效值。", "align as"),
    keyword("alignof", "/\u0259\u02c8la\u026an \u028cv/", "额赖恩-奥夫", "内存与类型", 2, "取得类型的字节对齐要求。", "alignof 是编译期一元运算符，返回 std::size_t，说明该类型对象地址必须满足的对齐边界。操作数是类型标识而不是运行时对象。", "std::size_t value = alignof(double);", "alignof 描述地址边界，sizeof 描述对象大小；二者经常不同。", "align of"),
    keyword("and", "/\u00e6nd/", "安德", "运算符替代词", 1, "逻辑与运算符 && 的关键字替代写法。", "在 C++ 中 and 与 && 完全等价，是内建替代运算符标记，不需要包含头文件。左右操作数按逻辑与规则求值并具有短路行为。", "if (ready and valid) { run(); }", "不要与 C# 模式匹配中的 and 混淆；C++ 的 and 就是 &&。"),
    keyword("and_eq", "/\u00e6nd \u02c8i\u02d0kw\u0259l/", "安德-伊阔", "运算符替代词", 2, "按位与赋值运算符 &= 的替代写法。", "and_eq 与 &= 具有完全相同的语法、优先级和求值结果，把右操作数按位与到左侧可修改对象。", "flags and_eq mask;", "它执行按位运算，不是逻辑短路运算；逻辑与使用 and。", "and equal"),
    keyword("asm", "/\u02c8\u00e6z\u0259m/", "艾泽姆", "底层与互操作", 3, "引入实现定义的内联汇编声明。", "asm 允许编译器提供内联汇编扩展，但标准只保留语法入口，不规定汇编文本格式、约束或可移植行为。具体写法完全依赖编译器。", "asm(\"nop\");", "内联汇编通常破坏跨平台性和优化假设；优先使用标准库、内建函数或独立汇编模块。"),
    keyword("auto", "/\u02c8\u0254\u02d0to\u028a/", "奥托", "类型推导", 1, "让编译器从初始化表达式推导变量类型。", "C++ 的 auto 是占位类型说明符，编译器按模板实参推导规则确定具体类型。它还可用于尾置返回类型、泛型 Lambda 参数和结构化绑定相关声明。", "auto count = items.size();\nauto name = std::string{\"Ada\"};", "auto 通常会丢弃顶层 const 和引用；需要保持引用时写 auto&、const auto& 或 decltype(auto)。"),
    keyword("bitand", "/b\u026at \u00e6nd/", "比特-安德", "运算符替代词", 2, "按位与运算符 & 的关键字替代写法。", "bitand 与 & 完全等价，可执行整数按位与，也可出现在声明中的引用符号位置。现代代码通常仍使用符号写法。", "auto low = value bitand 0xff;", "它不是逻辑与；逻辑短路运算使用 && 或 and。", "bit and"),
    keyword("bitor", "/b\u026at \u0254\u02d0r/", "比特-奥尔", "运算符替代词", 2, "按位或运算符 | 的关键字替代写法。", "bitor 与 | 完全等价，对整数位执行或运算。它是 C++ 内建关键字，不需要旧式 iso646 头文件。", "auto combined = read bitor write;", "按位或不会短路；逻辑或应使用 || 或 or。", "bit or"),
    keyword("bool", "/bu\u02d0l/", "布尔", "基础类型", 1, "声明 true 或 false 的布尔类型。", "bool 是 C++ 内建类型。整数、指针等可在条件中转换为 bool，零或空指针为 false，其余通常为 true。", "bool ready = count > 0;\nif (ready) { start(); }", "避免与整数状态码混用；函数返回 bool 时应明确 true 和 false 的业务含义。"),
    keyword("catch", "/k\u00e6t\u0283/", "凯奇", "异常处理", 1, "捕获与参数类型匹配的 C++ 异常。", "catch 紧随 try 块，可按值、引用或万能省略号接收异常。处理派生异常的 catch 应放在基类之前，常用 const 引用避免复制和切片。", "try { load(); }\ncatch (const std::exception& ex) {\n    log(ex.what());\n}", "重新抛出当前异常应写 throw;，不要写 throw ex;，后者可能复制并切片。"),
    keyword("char8_t", "/t\u0283\u0251\u02d0r e\u026at ti\u02d0/", "恰尔-艾特-提", "字符类型", 2, "声明用于 UTF-8 代码单元的独立字符类型。", "char8_t 是无符号整数性质的字符类型，用于 u8 字面量和 UTF-8 代码单元。它与 char、unsigned char 是不同类型。", "const char8_t* text = u8\"你好\";", "一个 char8_t 只是一个 UTF-8 代码单元，不一定对应完整 Unicode 字符。", "char eight t"),
    keyword("char16_t", "/t\u0283\u0251\u02d0r s\u026aks\u02c8ti\u02d0n ti\u02d0/", "恰尔-西克斯廷-提", "字符类型", 2, "声明用于 UTF-16 代码单元的字符类型。", "char16_t 是独立基础类型，与 u 字符及字符串字面量配合。某些 Unicode 字符需要两个 char16_t 代理代码单元。", "const char16_t* text = u\"hello\";", "代码单元不等于用户感知字符；文本遍历需要理解代理项和组合字符。", "char sixteen t"),
    keyword("char32_t", "/t\u0283\u0251\u02d0r \u03b8\u025c\u02d0rti tu\u02d0 ti\u02d0/", "恰尔-瑟提图-提", "字符类型", 2, "声明可表示 UTF-32 代码单元的字符类型。", "char32_t 是独立基础类型，与 U 字面量配合，宽度足以表示 Unicode 代码点。它仍不等同于完整的用户感知字符。", "char32_t symbol = U'\u03a9';", "即使每个值可表示一个代码点，组合序列仍可能由多个值组成一个显示字符。", "char thirty two t"),
    keyword("class", "/kl\u00e6s/", "克拉斯", "面向对象", 1, "声明具有成员、封装和继承能力的类类型。", "class 定义用户类型，成员默认 private，基类默认私有继承。C++ 支持多继承、虚函数、模板、资源管理构造与析构等完整对象模型。", "class Widget {\npublic:\n    explicit Widget(int id) : id_(id) {}\nprivate:\n    int id_;\n};", "资源所有权应遵循 RAII；不要依赖垃圾回收器自动释放本地资源。"),
    keyword("compl", "/\u02c8k\u0251\u02d0mpl\u0259m\u0259nt/", "康普勒门特", "运算符替代词", 2, "按位取反运算符 ~ 的关键字替代写法。", "compl 与一元运算符 ~ 完全等价，对整数提升后的位模式逐位取反。", "auto inverted = compl mask;", "它不是逻辑非；逻辑非使用 ! 或 not。", "complement"),
    keyword("concept", "/\u02c8k\u0251\u02d0nsept/", "康塞普特", "模板与约束", 2, "为模板实参需求声明具名布尔约束。", "concept 把 requires 表达式或其他编译期布尔条件命名，让模板接口在声明处表达类型必须支持的操作，并改善重载选择与诊断。", "template<class T>\nconcept Addable = requires(T a, T b) { a + b; };", "概念应描述语义能力而非偶然成员集合；过度具体会降低泛型复用性。"),
    keyword("const", "/k\u0251\u02d0nst/", "康斯特", "限定与常量", 1, "限定对象不可通过该路径修改，并参与成员函数重载。", "const 可限定对象、指针层级和成员函数。const 成员函数承诺不修改可观察对象状态，并可被 const 对象调用；满足规则的整型常量还可用于编译期上下文。", "int size() const { return size_; }\nconst int limit = 64;", "const 通常是浅层限定；指针指向内容和成员所引用对象是否可变取决于限定位置。"),
    keyword("consteval", "/k\u0251\u02d0nst \u026a\u02c8v\u00e6l/", "康斯特-伊瓦尔", "编译期计算", 3, "声明每次可能求值的调用都必须在编译期完成。", "consteval 函数是立即函数。其调用若产生可能求值的结果，必须形成常量表达式，否则程序无法通过编译。", "consteval int square(int x) { return x * x; }\nconstexpr int value = square(4);", "consteval 比 constexpr 更严格；需要同时支持运行时调用时应使用 constexpr。", "const eval"),
    keyword("constexpr", "/k\u0251\u02d0nst \u026ak\u02c8spres\u0259r/", "康斯特-伊克斯普瑞", "编译期计算", 2, "允许变量、函数或构造过程参与常量表达式。", "constexpr 表示实体可在满足输入和上下文条件时于编译期求值。constexpr 函数也可在非常量参数下运行时执行。", "constexpr int cube(int x) { return x * x * x; }\nstatic_assert(cube(3) == 27);", "constexpr 不保证每次调用都在编译期执行；强制立即求值使用 consteval。", "const expression"),
    keyword("constinit", "/k\u0251\u02d0nst \u026a\u02c8n\u026at/", "康斯特-伊尼特", "编译期计算", 3, "要求静态或线程存储期变量进行静态初始化。", "constinit 用于避免动态初始化顺序问题，编译器会验证变量初始化可在静态阶段完成。它不使变量随后变为只读。", "constinit int startup_code = 42;", "constinit 与 const 不同：前者约束初始化时机，后者约束后续修改。", "const init"),
    keyword("const_cast", "/k\u0251\u02d0nst k\u00e6st/", "康斯特-卡斯特", "类型转换", 3, "增加或移除指针/引用的 cv 限定。", "const_cast 是四种命名转换之一，主要用于调整 const 或 volatile 限定。若原对象本来就是 const，通过移除限定后的路径修改它会导致未定义行为。", "void legacy(char*);\nconst char* text = get_text();\nlegacy(const_cast<char*>(text));", "它不能完成普通数值或继承转换；移除 const 往往说明旧 API 契约需要重新审视。", "const cast"),
    keyword("co_await", "/ko\u028a \u0259\u02c8we\u026at/", "口-额维特", "协程", 3, "在协程中挂起直到可等待对象准备完成。", "co_await 把表达式转换为 awaiter，并按 await_ready、await_suspend、await_resume 协议决定是否挂起以及恢复时得到什么结果。", "auto value = co_await async_read();", "C++ 协程本身不提供调度器；线程、执行器和生命周期由所用协程类型与库决定。", "co await"),
    keyword("co_return", "/ko\u028a r\u026a\u02c8t\u025c\u02d0rn/", "口-瑞特恩", "协程", 3, "结束协程并向 promise 提交结果。", "co_return 类似协程版本的 return。带表达式时调用 promise.return_value，无表达式时调用 return_void，随后进入最终挂起流程。", "task<int> answer() {\n    co_return 42;\n}", "协程中使用 co_return 的可用形式取决于 promise 类型提供的接口。", "co return"),
    keyword("co_yield", "/ko\u028a ji\u02d0ld/", "口-伊尔德", "协程", 3, "从协程产生一个值并挂起。", "co_yield 通常转换为 co_await promise.yield_value(expr)，适合实现生成器和惰性序列。调用方恢复协程后从挂起点继续。", "generator<int> count() {\n    for (int i = 0; i < 3; ++i) co_yield i;\n}", "产生值的引用或视图必须遵守协程帧和下一次恢复之间的生命周期。", "co yield"),
    keyword("decltype", "/dek ta\u026ap/", "德克-泰普", "类型推导", 2, "按表达式形式精确推导其声明类型。", "decltype 不对普通操作数求值，并保留比 auto 更精确的引用和值类别信息。decltype(auto) 可让返回类型遵循 decltype 规则。", "int value = 0;\ndecltype((value)) ref = value; // int&", "变量名外额外括号可能把结果从声明类型变成左值引用类型。", "decl type"),
    keyword("default", "/d\u026a\u02c8f\u0254\u02d0lt/", "迪-佛特", "类与流程", 2, "定义 switch 兜底分支，或显式生成默认特殊成员。", "default 既可作为 switch 标签，也可写 = default，要求编译器生成构造、析构或复制/移动等特殊成员的默认实现。", "Widget() = default;\nWidget(const Widget&) = default;", "被 default 的函数仍可能因成员不可复制等原因被隐式定义为 deleted。"),
    keyword("delete", "/d\u026a\u02c8li\u02d0t/", "迪-利特", "资源与对象", 1, "释放 new 创建的对象，或禁止某个函数形式。", "delete 表达式调用析构函数并释放动态对象；数组必须使用 delete[]。在函数声明后写 = delete 可让特定重载明确不可调用。", "delete pointer;\ndelete[] array;\nWidget(const Widget&) = delete;", "现代代码优先智能指针和容器；new/delete 配对错误会造成泄漏或未定义行为。"),
    keyword("dynamic_cast", "/da\u026a\u02c8n\u00e6m\u026ak k\u00e6st/", "戴纳米克-卡斯特", "类型转换", 2, "在多态类层次中执行运行时检查转换。", "dynamic_cast 可安全向下转型或横向转型。指针转换失败返回 nullptr，引用转换失败抛出 std::bad_cast；源类通常必须是多态类型。", "if (auto* dog = dynamic_cast<Dog*>(animal)) {\n    dog->bark();\n}", "频繁向下转换可能表明接口缺少合适的虚函数或访问者设计。", "dynamic cast"),
    keyword("enum", "/\u02c8i\u02d0n\u028cm/", "伊纳姆", "复合类型", 1, "声明具名整数常量类型，可选择作用域枚举。", "enum 声明枚举类型；enum class 或 enum struct 创建强作用域枚举，不会把成员名注入外层，也不会隐式转换为整数。", "enum class State { idle, running, done };", "优先使用作用域枚举减少名称污染和意外整数转换。"),
    keyword("explicit", "/\u026ak\u02c8spl\u026as\u026at/", "伊克斯普利西特", "类与转换", 2, "阻止构造函数或转换函数参与非显式转换。", "explicit 常修饰单参数构造函数和转换运算符，要求调用点明确写出目标类型。它也可带编译期布尔条件形成条件 explicit。", "class Meter {\npublic:\n    explicit Meter(double value) : value_(value) {}\n};", "可隐式转换的构造函数会扩大重载候选并产生意外转换，默认应谨慎。"),
    keyword("export", "/\u026ak\u02c8sp\u0254\u02d0rt/", "伊克斯波特", "模块与模板", 3, "从模块接口导出声明或声明导出的模块区域。", "export 在模块接口单元中让声明对导入者可见，也可写 export module 声明模块接口或包围一组导出声明。", "export module geometry;\nexport double area(double radius);", "导出控制模块可见性，不等同于动态库符号导出或传统头文件链接属性。"),
    keyword("extern", "/\u026ak\u02c8st\u025c\u02d0rn/", "伊克斯特恩", "链接与存储", 2, "声明外部链接实体或指定语言链接。", "extern 可声明由其他翻译单元定义的对象和函数；extern \"C\" 语言链接说明用于与 C ABI 名称链接。具体 ABI 仍由实现和平台决定。", "extern int shared_count;\nextern \"C\" void c_api();", "语言链接不会自动让参数类型变成 C 兼容布局，边界类型仍需仔细设计。"),
    keyword("false", "/f\u0254\u02d0ls/", "佛尔斯", "字面量", 1, "bool 类型的假值字面量。", "false 是 C++ bool 的两个值之一，在整数转换中对应 0，可直接用于条件、初始化和常量表达式。", "constexpr bool enabled = false;", "不要用多个布尔变量编码复杂互斥状态，枚举或状态类型通常更清楚。"),
    keyword("for", "/f\u0254\u02d0r/", "佛尔", "流程控制", 1, "创建经典三段循环或范围 for 循环。", "for 可使用初始化、条件和迭代表达式，也可写范围 for 依次绑定序列元素。范围 for 会借助 begin/end 机制，并能用引用避免复制。", "for (const auto& item : items) {\n    use(item);\n}", "修改元素时使用 auto&；只读且避免复制时使用 const auto&。"),
    keyword("friend", "/frend/", "弗兰德", "面向对象", 2, "授予指定函数或类型访问私有/保护成员的权限。", "friend 声明不会让被授权函数变成成员，也不会传递、继承或自动互惠。它常用于紧密协作的运算符和工厂。", "class Box {\n    friend bool equal(const Box&, const Box&);\n    int value_;\n};", "friend 会扩大封装边界，应只授予真正需要访问内部不变量的少量协作者。"),
    keyword("inline", "/\u02c8\u026anla\u026an/", "因赖恩", "链接与函数", 2, "允许实体在多个翻译单元中具有相同定义。", "inline 可修饰函数和变量，核心语言意义涉及单一定义规则；编译器是否展开函数调用是独立优化决定。类内定义的成员通常隐式 inline。", "inline constexpr int buffer_size = 256;", "不要把 inline 当作强制性能指令；先关注定义一致性和可测量性能。"),
    keyword("mutable", "/\u02c8mju\u02d0t\u0259b\u0259l/", "谬特博", "限定与 Lambda", 2, "允许 const 对象修改特定成员，或让 Lambda 副本可变。", "成员上的 mutable 排除该成员的 const 限制，常用于缓存和互斥量。Lambda 后的 mutable 让按值捕获的副本可在调用运算符中修改。", "mutable std::mutex mutex_;\nauto next = [n = 0]() mutable { return ++n; };", "mutable 应维护逻辑 const；不要用它偷偷改变调用者认为稳定的业务状态。"),
    keyword("namespace", "/\u02c8ne\u026amspe\u026as/", "内姆斯佩斯", "代码组织", 1, "创建类型和函数的命名范围。", "namespace 组织声明、避免名称冲突，并支持嵌套命名空间、匿名命名空间和别名。命名空间可在多个文件中重复打开。", "namespace app::io {\n    void save();\n}", "头文件中避免 using namespace，它会把大量名称注入所有包含者的作用域。"),
    keyword("new", "/nu\u02d0/", "纽", "资源与对象", 1, "动态分配并构造对象，或执行定位构造。", "new 表达式取得存储并调用构造函数，失败通常抛出 std::bad_alloc。placement new 可在已有存储上构造对象，不负责分配。", "auto value = std::make_unique<Widget>(42);", "业务代码优先 make_unique、make_shared 和容器，直接 new 会增加所有权与异常安全负担。"),
    keyword("noexcept", "/no\u028a \u026ak\u02c8sept/", "诺-伊克塞普特", "异常处理", 2, "声明函数不会传播异常，或查询表达式是否不抛异常。", "noexcept 说明符参与函数类型和移动优化。若异常逃出 noexcept(true) 函数，程序会调用 std::terminate；noexcept(expr) 可条件化该承诺。", "Widget(Widget&&) noexcept = default;\nstatic_assert(noexcept(swap(a, b)));", "只有能真正维持承诺时才标记；noexcept 不会自动捕获或处理异常。", "no except"),
    keyword("not", "/n\u0251\u02d0t/", "纳特", "运算符替代词", 1, "逻辑非运算符 ! 的关键字替代写法。", "not 与 ! 完全等价，对操作数进行上下文 bool 转换后取反，并使用与符号写法相同的优先级、重载解析和求值规则。", "if (not ready) { wait(); }", "它不是模式组合器；C++ 中 not 只是 ! 的替代标记。"),
    keyword("not_eq", "/n\u0251\u02d0t \u02c8i\u02d0kw\u0259l/", "纳特-伊阔", "运算符替代词", 2, "不等于运算符 != 的关键字替代写法。", "not_eq 与 != 完全等价，使用相同的重载、比较、优先级和模板解析规则；它不是独立函数，也不需要包含额外头文件。", "if (left not_eq right) { update(); }", "可读性取决于团队约定；同一代码库应保持符号或替代词风格一致。", "not equal"),
    keyword("nullptr", "/\u02c8n\u028cl p\u0254\u026ant\u0259r/", "纳尔-坡因特", "字面量", 1, "表示类型安全的空指针字面量。", "nullptr 具有 std::nullptr_t 类型，可转换为任意指针或成员指针，但不会像整数 0 那样与数值重载混淆。", "Widget* widget = nullptr;\nif (widget == nullptr) { return; }", "现代 C++ 不应使用 NULL 或 0 表示空指针，尤其是在重载调用中。", "null pointer"),
    keyword("operator", "/\u02c8\u0251\u02d0p\u0259re\u026at\u0259r/", "奥珀瑞特", "类与转换", 2, "声明重载运算符或用户定义转换函数。", "operator 后接符号、new/delete、字面量后缀或目标类型，允许类为语言运算语法提供行为。至少一个普通参数通常必须是用户定义类型。", "friend Vector operator+(Vector a, const Vector& b) {\n    a += b;\n    return a;\n}", "重载应保持运算符直觉、代数关系和异常安全，不要赋予完全无关的副作用。"),
    keyword("or", "/\u0254\u02d0r/", "奥尔", "运算符替代词", 1, "逻辑或运算符 || 的关键字替代写法。", "or 与 || 完全等价，左侧为 true 时不会求值右侧，保留逻辑或的短路语义。", "if (cached or load()) { use(); }", "按位或使用 | 或 bitor，不具有短路行为。"),
    keyword("or_eq", "/\u0254\u02d0r \u02c8i\u02d0kw\u0259l/", "奥尔-伊阔", "运算符替代词", 2, "按位或赋值运算符 |= 的替代写法。", "or_eq 与 |= 完全等价，把右操作数的位合并到左侧可修改对象，并遵循复合赋值的类型转换、重载解析和单次左值求值规则。", "permissions or_eq write_flag;", "它不是逻辑或赋值；运算会求值右侧且按位处理。", "or equal"),
    keyword("private", "/\u02c8pra\u026av\u0259t/", "普赖维特", "访问控制", 1, "只允许当前类及其友元访问成员或基类部分。", "private 成员对普通派生类和外部调用者不可访问。private 继承还会把基类 public/protected 成员作为派生类私有实现细节。", "class Account {\nprivate:\n    int balance_ = 0;\n};", "默认从最小访问范围开始，避免把内部表示变成长期公共契约。"),
    keyword("protected", "/pr\u0259\u02c8tekt\u026ad/", "普若泰克提德", "访问控制", 2, "允许当前类、友元和派生类访问成员。", "protected 为继承者提供扩展接口，但派生类通过对象访问保护成员还受静态类型规则限制。", "class Shape {\nprotected:\n    virtual void changed() {}\n};", "保护数据成员会让所有派生类依赖表示，通常优先保护函数接口。"),
    keyword("public", "/\u02c8p\u028cbl\u026ak/", "帕布利克", "访问控制", 1, "向所有可见调用者开放成员或基类接口。", "public 成员构成类型的外部契约。public 继承表达 is-a 关系，并保持基类 public/protected 访问级别。", "class Point {\npublic:\n    int x() const { return x_; }\nprivate:\n    int x_ = 0;\n};", "公共接口变更成本最高，应隐藏表示并明确所有权、异常和生命周期规则。"),
    keyword("register", "/\u02c8red\u0292\u026ast\u0259r/", "瑞吉斯特", "兼容保留词", 3, "历史存储类关键字，现代 C++ 中不再提供寄存器语义。", "register 为兼容旧代码仍被保留为关键字，但现代 C++ 不允许依赖它进行寄存器分配；优化器自行决定存储位置。", "// Historical code:\n// register int index;", "新代码不要使用 register；它不会提供可控性能收益。"),
    keyword("reinterpret_cast", "/ri\u02d0\u026an\u02c8t\u025c\u02d0rpr\u026at k\u00e6st/", "瑞因特普瑞特-卡斯特", "类型转换", 3, "执行低层级的指针、整数或表示重解释转换。", "reinterpret_cast 明确请求实现定义或低层转换，常见于互操作和内存地址处理。得到的指针能否安全解引用仍受对齐、对象生命周期和别名规则限制。", "auto address = reinterpret_cast<std::uintptr_t>(pointer);", "它不创造目标类型对象，也不绕过严格别名和生命周期规则。", "reinterpret cast"),
    keyword("requires", "/r\u026a\u02c8kwa\u026a\u0259rz/", "瑞-夸尔兹", "模板与约束", 2, "声明模板约束或构造 requires 表达式。", "requires 可放在模板声明或函数后形成约束子句，也可写 requires(...) { ... } 检查类型、表达式和嵌套约束是否有效。", "template<class T>\nrequires std::integral<T>\nT twice(T value) { return value * 2; }", "requires 主要参与可用性和重载选择，不是运行时 if 判断。"),
    keyword("static", "/\u02c8st\u00e6t\u026ak/", "斯泰提克", "存储与成员", 1, "声明静态存储、内部链接或属于类本身的成员。", "命名空间作用域 static 可给予内部链接；块内 static 延长对象生命周期；类 static 成员不属于单个实例。static 还可修饰 Lambda 和断言等不同语法。", "class Counter {\npublic:\n    static int total;\n};", "函数局部 static 初始化是线程安全的，但共享可变对象后续访问仍需要同步。"),
    keyword("static_assert", "/\u02c8st\u00e6t\u026ak \u0259\u02c8s\u025c\u02d0rt/", "斯泰提克-额瑟特", "编译期计算", 2, "在编译期验证布尔常量条件。", "static_assert 条件为 false 时使编译失败，并可附带诊断字符串。它适合检查概念、大小、布局和模板假设。", "static_assert(sizeof(void*) >= 4, \"unsupported pointer size\");", "它不生成运行时代码，也不能检查依赖运行时输入的条件。", "static assert"),
    keyword("static_cast", "/\u02c8st\u00e6t\u026ak k\u00e6st/", "斯泰提克-卡斯特", "类型转换", 2, "执行编译期可检查的显式转换。", "static_cast 用于数值转换、明确构造转换、void 指针恢复和已知安全关系下的继承转换。它不会为向下转型进行运行时类型检查。", "double ratio = 0.75;\nint percent = static_cast<int>(ratio * 100);", "多态层次中不确定的向下转换应使用 dynamic_cast 或重新设计接口。", "static cast"),
    keyword("struct", "/str\u028ckt/", "斯特拉克特", "复合类型", 1, "声明成员默认 public 的类类型。", "C++ 的 struct 与 class 具有相同对象模型能力，可有构造、析构、虚函数、模板和继承；主要区别是成员及基类默认访问级别为 public。", "struct Point {\n    double x{};\n    double y{};\n};", "用 struct 表达简单数据聚合、class 表达封装是惯例，不是语言强制。"),
    keyword("template", "/\u02c8templ\u0259t/", "坦普雷特", "模板与约束", 1, "声明参数化的函数、类、变量或别名。", "template 引入类型、非类型或模板参数，让一份定义在实例化时生成适配具体实参的实体。它也用于依赖名称后的模板消歧。", "template<class T>\nT maximum(T a, T b) { return a < b ? b : a; }", "模板定义通常必须对实例化点可见，因此经常放在头文件或模块接口中。"),
    keyword("this", "/\u00f0\u026as/", "泽斯", "面向对象", 1, "在非静态成员函数中指向当前对象。", "this 是指针，其类型反映成员函数的 const/volatile 限定。它可用于消除名称遮蔽、返回当前对象或在显式对象成员语法之外访问成员。", "Widget& rename(std::string name) {\n    this->name_ = std::move(name);\n    return *this;\n}", "不要让 this 或成员引用逃逸到超过对象生命周期的异步工作中。"),
    keyword("thread_local", "/\u03b8red \u02c8lo\u028ak\u0259l/", "斯瑞德-楼口", "并发与存储", 2, "让每个线程拥有变量的独立实例。", "thread_local 赋予线程存储期。命名空间、块或静态成员位置可使用，每个线程首次需要时获得各自实例。", "thread_local std::string last_error;", "线程局部状态会增加测试和线程池复用时的隐式上下文，仍需明确清理策略。", "thread local"),
    keyword("throw", "/\u03b8ro\u028a/", "思柔", "异常处理", 1, "抛出异常对象或重新抛出当前异常。", "throw expr 初始化异常对象并启动栈展开；catch 中单独写 throw; 会重新抛出当前异常并保留其动态类型。", "if (index >= size) {\n    throw std::out_of_range{\"index\"};\n}", "析构函数通常不应让异常逃逸，尤其是在已有异常展开期间。"),
    keyword("true", "/tru\u02d0/", "楚", "字面量", 1, "bool 类型的真值字面量。", "true 是 C++ bool 的两个值之一，在整数转换中对应 1，并可参与编译期常量表达式。", "constexpr bool logging = true;", "条件本身已经是 bool 时直接使用，不必写 flag == true。"),
    keyword("try", "/tra\u026a/", "踹", "异常处理", 1, "建立异常处理保护块或函数级 try 块。", "try 后接一个或多个 catch。普通 try 保护语句块；函数 try 块还可覆盖构造函数初始化列表和函数体。", "try { connect(); }\ncatch (const network_error& ex) { recover(ex); }", "只捕获能够处理、转换或记录的异常，并优先按 const 引用捕获。"),
    keyword("typeid", "/ta\u026ap a\u026a\u02c8di\u02d0/", "泰普-艾迪", "类型信息", 2, "查询类型信息对象或多态表达式的动态类型。", "typeid(type) 或 typeid(expr) 返回 const std::type_info&。对多态左值表达式可报告动态类型；对空多态指针解引用表达式会抛 std::bad_typeid。", "std::cout << typeid(value).name();", "type_info::name 的文本是实现定义的，不适合作为稳定序列化格式。", "type I D"),
    keyword("typename", "/ta\u026ap ne\u026am/", "泰普-内姆", "模板与约束", 2, "声明模板类型参数或消除依赖类型名歧义。", "typename 可替代 class 引入类型模板参数，也用于告诉编译器某个依赖限定名称是类型，而不是静态成员或值。", "template<class T>\ntypename T::value_type first(const T& values);", "只在名称确实依赖模板参数且语法需要消歧时添加；非依赖名称不靠它修复。", "type name"),
    keyword("union", "/\u02c8ju\u02d0ni\u0259n/", "尤尼恩", "复合类型", 2, "声明多个成员共享同一存储的类类型。", "C++ union 可包含具有构造函数的成员，但程序必须管理当前活动成员的生命周期。匿名 union 还能把成员名直接注入外围作用域。", "union Number {\n    int integer;\n    double real;\n};", "复杂变体优先 std::variant，它显式跟踪活动类型并提供更安全的访问。"),
    keyword("using", "/\u02c8ju\u02d0z\u026a\u014b/", "尤-辛", "代码组织", 1, "引入名称、创建类型别名或声明 using 指令。", "using 可创建别名、引入基类重载、把命名空间名称带入作用域，也可形成 alias template。它不负责 C# 式资源释放。", "using user_id = std::uint64_t;\nusing base::process;", "头文件中避免 using namespace；类型别名通常比 typedef 更易读且支持模板化。"),
    keyword("virtual", "/\u02c8v\u025c\u02d0rt\u0283u\u0259l/", "沃丘尔", "面向对象", 2, "启用运行时多态分派或虚继承。", "virtual 成员通过基类指针或引用调用时按对象动态类型选择最终重写。虚析构函数确保通过基类指针删除派生对象时完整析构。", "struct Shape {\n    virtual ~Shape() = default;\n    virtual double area() const = 0;\n};", "多态基类通常需要 public virtual 析构，或 protected 非虚析构以禁止基类删除。"),
    keyword("wchar_t", "/wa\u026ad t\u0283\u0251\u02d0r ti\u02d0/", "外德-恰尔-提", "字符类型", 2, "声明实现定义宽度的宽字符类型。", "wchar_t 是独立基础类型，用于 L 字符和字符串字面量。其宽度与编码依平台而异，不能假设统一采用 UTF-16 或 UTF-32。", "const wchar_t* text = L\"wide\";", "跨平台 Unicode 数据优先明确的 UTF 编码和 char8_t/char16_t/char32_t 或成熟文本库。", "wide char t"),
    keyword("xor", "/\u02c8eks \u0254\u02d0r/", "艾克斯-奥尔", "运算符替代词", 2, "按位异或运算符 ^ 的关键字替代写法。", "xor 与 ^ 完全等价，对整数位执行异或；相同位得到 0，不同位得到 1。", "auto changed = before xor after;", "它不是逻辑二选一语义的专用运算符，而是按位操作。", "X or"),
    keyword("xor_eq", "/\u02c8eks \u0254\u02d0r \u02c8i\u02d0kw\u0259l/", "艾克斯-奥尔-伊阔", "运算符替代词", 2, "按位异或赋值运算符 ^= 的替代写法。", "xor_eq 与 ^= 完全等价，把右操作数按位异或到左侧对象，并沿用复合赋值的类型转换、运算符重载与求值顺序规则。", "state xor_eq toggle_mask;", "重复对同一掩码 xor_eq 两次会恢复原位模式，但不要据此隐藏难读的状态逻辑。", "X or equal"),
    keyword("final", "/\u02c8fa\u026an\u0259l/", "发伊纳尔", "面向对象", 2, "阻止类继续被继承，或阻止虚函数继续被重写。", "final 是具有特殊语法含义的上下文标识符。写在类名后表示该类不能再作为基类；写在虚函数声明后表示后续派生类不能覆盖这个最终重写。", "class Token final {};\n\nvoid close() final;", "final 只限制继承或虚重写，不会自动使对象不可变，也不改变成员访问级别。", "final", "上下文关键字"),
    keyword("override", "/\u02cco\u028av\u0259r\u02c8ra\u026ad/", "欧沃赖德", "面向对象", 2, "明确声明成员函数正在重写基类虚函数。", "override 是成员函数声明中的上下文标识符。编译器会验证基类存在签名匹配的虚函数；如果参数、const、引用限定或 noexcept 等不匹配，声明会直接报错。", "struct Circle : Shape {\n    double area() const override;\n};", "override 不负责开启虚分派；基类成员必须已经是 virtual。重写函数通常无需重复写 virtual。", "override", "上下文关键字"),
    keyword("module", "/\u02c8m\u0251\u02d0d\u0292u\u02d0l/", "莫久尔", "模块", 3, "声明模块单元、全局模块片段或私有模块片段。", "module 是 C++20 模块语法中的上下文标识符。module name; 声明当前单元所属模块，module; 开启全局模块片段，module : private; 开启私有模块片段。", "export module geometry;\n\nexport double area(double radius);", "模块名和文件名没有语言层面的固定绑定；具体构建顺序与文件约定由编译器和构建系统决定。", "module", "上下文关键字"),
    keyword("import", "/\u026am\u02c8p\u0254\u02d0rt/", "因波特", "模块", 3, "导入模块、模块分区或可导入头文件单元。", "import 是 C++20 模块声明中的上下文标识符。导入会让目标模块导出的声明在当前翻译单元可见；export import 还能把依赖重新导出给本模块的使用者。", "import geometry;\nimport <vector>;\nexport import :utilities;", "import 不等同于文本复制式 #include；宏通常不会像头文件包含那样跨模块边界传播。", "import", "上下文关键字")
  ];

  const customByWord = new Map(custom.map(item => [item.w, item]));
  const sourceBanks = [window.LANGUAGE_BANKS.c, window.LANGUAGE_BANKS.csharp];

  function inherited(word) {
    for (const bank of sourceBanks) {
      const source = bank.keywords.find(item => item.w === word);
      if (!source) continue;
      return {
        ...source,
        kind: "保留关键字",
        detail: source.detail
          .replaceAll("在 C 中", "在 C++ 中")
          .replaceAll("C 的", "C++ 的")
          .replaceAll("C17", "C++20")
      };
    }
    throw new Error(`Missing C++ keyword content: ${word}`);
  }

  const keywords = [...words, ...contextualWords].map(word => customByWord.get(word) || inherited(word));

  window.LANGUAGE_BANKS = window.LANGUAGE_BANKS || {};
  window.LANGUAGE_BANKS.cpp = {
    id: "cpp",
    name: "C++",
    standard: "C++20 · 96 个特殊词汇",
    keywords,
    reserved: [...words],
    contextual: [...contextualWords]
  };
})();
