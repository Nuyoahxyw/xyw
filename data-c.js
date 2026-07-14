(function () {
  "use strict";

  function keyword(w, ipa, cn, c, l, summary, detail, code, tip, speech) {
    return { w, ipa, cn, c, l, summary, detail, code, tip, speech: speech || w, kind: "保留关键字" };
  }

  const keywords = [
    keyword("_Alignas", "/\u0259\u02c8la\u026an \u00e6z/", "额赖恩-艾兹", "内存与类型", 3, "为对象指定更严格的内存对齐要求。", "_Alignas 是 C11 对齐说明符，可使用整数对齐值或类型来要求对象地址满足特定边界。实现不能用它削弱类型原本需要的对齐。", "_Alignas(32) unsigned char buffer[64];", "对齐值必须是实现支持的有效对齐；常用宏写法是 <stdalign.h> 中的 alignas。", "align as"),
    keyword("_Alignof", "/\u0259\u02c8la\u026an \u028cv/", "额赖恩-奥夫", "内存与类型", 3, "取得类型所需的字节对齐值。", "_Alignof 是 C11 一元运算符，结果类型为 size_t，返回指定完整对象类型的对齐要求。它只查询类型，不会计算表达式或访问对象。", "size_t a = _Alignof(double);", "不要把对齐值与 sizeof 混淆：前者描述地址边界，后者描述对象占用字节数。", "align of"),
    keyword("_Atomic", "/\u0259\u02c8t\u0251\u02d0m\u026ak/", "额-托米克", "并发与限定", 3, "声明原子类型或原子类型说明符。", "_Atomic 让对象访问具备 C 内存模型定义的原子性，可写作 _Atomic(type) 或作为类型限定符使用。具体读改写操作通常配合 <stdatomic.h>。", "_Atomic(int) counter = 0;", "原子不等于所有多步业务操作自动安全；仍需选择正确的内存顺序和同步协议。", "atomic"),
    keyword("_Bool", "/bu\u02d0l/", "布尔", "基础类型", 1, "声明 C 的内建布尔整数类型。", "_Bool 只能保存 0 或 1，任何非零标量赋入后都会转换为 1。包含 <stdbool.h> 后通常使用更易读的 bool、true 和 false 宏。", "_Bool ready = 1;", "C17 中 bool 是头文件宏而不是关键字；不要把 C 的布尔类型规则与 C++ 完全等同。", "bool"),
    keyword("_Complex", "/\u02c8k\u0251\u02d0mpleks/", "康普莱克斯", "基础类型", 3, "声明复数浮点类型。", "_Complex 可与 float、double 或 long double 组合，表示具有实部和虚部的复数类型。复数运算与函数通常通过 <complex.h> 使用。", "double _Complex z = 1.0 + 2.0 * I;", "需要包含 <complex.h> 才能方便地使用 I、creal 和 cimag 等宏与函数。", "complex"),
    keyword("_Generic", "/d\u0292\u0259\u02c8ner\u026ak/", "杰-奈瑞克", "编译期选择", 3, "按表达式类型在编译期选择一个结果表达式。", "_Generic 是 C11 泛型选择语法。控制表达式不会被求值，编译器按其类型匹配关联列表，常用于实现类型安全的宏分派。", "#define type_name(x) _Generic((x), int: \"int\", double: \"double\", default: \"other\")", "关联列表中兼容类型不能重复；default 可防止没有匹配类型时编译失败。", "generic"),
    keyword("_Imaginary", "/\u026a\u02c8m\u00e6d\u0292\u0259neri/", "伊-麦杰内瑞", "基础类型", 3, "声明纯虚数类型的保留关键字。", "_Imaginary 为 C 标准保留了纯虚数类型语法，但实现可以不提供相关类型支持。实际可移植复数代码通常使用 _Complex 与 <complex.h>。", "/* implementation-dependent */\nfloat _Imaginary y;", "这是可选特性，许多主流编译器并不完整支持；不要把它作为跨平台接口基础。", "imaginary"),
    keyword("_Noreturn", "/no\u028a r\u026a\u02c8t\u025c\u02d0rn/", "诺-瑞特恩", "函数", 2, "声明函数调用后不会返回调用点。", "_Noreturn 是 C11 函数说明符，用于终止进程、永久跳转或无限循环的函数。它帮助编译器进行控制流诊断和优化。", "_Noreturn void fatal(const char *msg) {\n    fputs(msg, stderr);\n    abort();\n}", "如果被标记函数实际正常返回，行为未定义；常用 <stdnoreturn.h> 的 noreturn 宏改善可读性。", "no return"),
    keyword("_Static_assert", "/\u02c8st\u00e6t\u026ak \u0259\u02c8s\u025c\u02d0rt/", "斯泰提克-额瑟特", "编译期选择", 2, "在编译期验证整数常量条件。", "_Static_assert 在条件为零时让编译失败，并显示诊断消息。它不生成运行时代码，适合验证类型大小、结构布局和配置假设。", "_Static_assert(sizeof(int) >= 4, \"int is too small\");", "条件必须是整数常量表达式；它不能检查只能在运行时确定的值。", "static assert"),
    keyword("_Thread_local", "/\u03b8red \u02c8lo\u028ak\u0259l/", "斯瑞德-楼口", "存储期", 3, "让每个线程拥有对象的独立实例。", "_Thread_local 是 C11 线程存储期说明符。每个线程看到同名对象的不同实例，可与 static 或 extern 组合说明链接属性。", "_Thread_local unsigned int error_code;", "线程局部对象解决的是实例隔离，不会自动同步它引用的其他共享资源。", "thread local"),
    keyword("auto", "/\u02c8\u0254\u02d0to\u028a/", "奥托", "存储期", 2, "显式声明块作用域对象具有自动存储期。", "在 C 中 auto 是存储类说明符，表示对象进入代码块时创建、离开时结束；局部变量默认就是这种存储期，因此该关键字很少需要写。", "auto int count = 0;", "不要与 C++ 的 auto 类型推导混淆；C17 的 auto 不负责推断类型。"),
    keyword("break", "/bre\u026ak/", "布雷克", "流程控制", 1, "立即结束最近的循环或 switch。", "break 把控制转移到最近一层 for、while、do 或 switch 语句之后。它不会自动退出外层循环，也不能单独结束函数。", "while (1) {\n    if (done) break;\n}", "多层退出通常可通过提取函数、return 或清晰的状态变量表达。"),
    keyword("case", "/ke\u026as/", "凯斯", "流程控制", 1, "在 switch 中定义一个整数常量分支标签。", "case 后必须是整型常量表达式。switch 的控制表达式与标签值比较，匹配后从该标签继续执行，直到 break、return 或 switch 结束。", "switch (code) {\ncase 200: handle_ok(); break;\ndefault: handle_error();\n}", "C 允许分支贯穿；忘写 break 可能是错误，也可能是有意共享后续逻辑。"),
    keyword("char", "/t\u0283\u0251\u02d0r/", "恰尔", "基础类型", 1, "声明字符或最小可寻址整数类型。", "char 的大小定义为 1 字节，但字节位数由实现决定。普通 char 的有符号性也依实现而定，字符编码并不由 char 本身保证。", "char grade = 'A';\nchar text[] = \"C language\";", "处理原始字节时优先 unsigned char；普通 char 是否能表示负数不可移植。"),
    keyword("const", "/k\u0251\u02d0nst/", "康斯特", "并发与限定", 1, "限定通过该左值不能修改对象。", "const 是类型限定符，阻止通过带 const 限定的左值修改对象。它不一定让对象位于只读存储，也不保证其他非 const 别名不能修改同一对象。", "void print_text(const char *text);", "C 的 const 对象通常不是整数常量表达式，不能完全替代 enum 常量或宏。"),
    keyword("continue", "/k\u0259n\u02c8t\u026anju\u02d0/", "肯-听纽", "流程控制", 1, "跳过本次循环剩余语句并进入下一轮。", "continue 作用于最近一层循环。for 循环会先执行迭代表达式再检查条件；while 和 do 则转到条件判断位置。", "for (int i = 0; i < n; ++i) {\n    if (items[i] < 0) continue;\n    sum += items[i];\n}", "在 do-while 中 continue 会跳到尾部条件，而不是直接跳到循环体开头。"),
    keyword("default", "/d\u026a\u02c8f\u0254\u02d0lt/", "迪-佛特", "流程控制", 1, "定义 switch 没有 case 匹配时的兜底标签。", "default 是 switch 中可选的标签，最多出现一次。没有 case 匹配时从 default 开始执行；它可以放在 switch 内任意标签位置。", "switch (token) {\ndefault: report_unknown(token); break;\n}", "default 的位置不决定优先级；switch 仍先尝试所有 case 值是否匹配。"),
    keyword("do", "/du\u02d0/", "杜", "流程控制", 1, "创建先执行循环体、再检查条件的循环。", "do-while 至少执行一次循环体，然后在尾部判断标量条件是否非零。适合必须先读取或执行一次才能决定是否继续的过程。", "do {\n    value = read_value();\n} while (value < 0);", "结尾 while 条件之后必须写分号。"),
    keyword("double", "/\u02c8d\u028cb\u0259l/", "达博", "基础类型", 1, "声明双精度浮点类型。", "double 通常遵循实现的双精度浮点格式，范围和精度不少于 float。没有后缀的十进制浮点字面量默认具有 double 类型。", "double ratio = 1.0 / 3.0;", "浮点值常不能精确表示十进制小数，比较计算结果时应使用合理容差。"),
    keyword("else", "/els/", "艾尔斯", "流程控制", 1, "提供 if 条件为零时执行的替代分支。", "else 与最近一个尚未配对的 if 结合。它可以连接另一个 if 形成多分支选择，也可作为最终兜底分支。", "if (ready) start();\nelse wait();", "嵌套条件建议使用大括号，避免悬挂 else 造成阅读或维护错误。"),
    keyword("enum", "/\u02c8i\u02d0n\u028cm/", "伊纳姆", "复合类型", 1, "声明一组具名整数常量。", "enum 枚举把相关整数值绑定到名称。每个枚举常量具有 int 类型，未显式赋值时通常从 0 开始递增。", "enum state { IDLE, RUNNING, DONE };", "C 的枚举变量仍可保存实现允许范围内的整数；它不像某些语言那样形成严格封闭集合。"),
    keyword("extern", "/\u026ak\u02c8st\u025c\u02d0rn/", "伊克斯特恩", "存储期", 2, "声明具有外部或既有链接的对象或函数。", "extern 常用于只声明、暂不定义由其他翻译单元提供的全局对象或函数。对函数而言，普通函数声明默认就具有 extern 语义。", "extern int shared_count;\nextern void process(void);", "一个程序中具有外部链接的对象通常只能有一个定义，但可有多个兼容声明。"),
    keyword("float", "/flo\u028at/", "弗洛特", "基础类型", 1, "声明单精度浮点类型。", "float 通常占用比 double 更少的空间和精度。浮点字面量需加 f 或 F 后缀才是 float，否则表达式从 double 开始。", "float opacity = 0.75f;", "函数可变参数中 float 会提升为 double，读取 va_arg 时要按提升后的类型处理。"),
    keyword("for", "/f\u0254\u02d0r/", "佛尔", "流程控制", 1, "以初始化、条件和迭代组成循环。", "for 把循环初始化、继续条件和每轮更新集中在语句头部。三个表达式均可省略，但两个分号必须保留。", "for (int i = 0; i < count; ++i) {\n    visit(items[i]);\n}", "数组越界在 C 中不会自动检查，索引条件必须与真实数组长度一致。"),
    keyword("goto", "/\u02c8\u0261o\u028atu\u02d0/", "勾-图", "流程控制", 3, "跳转到同一函数内的命名标签。", "goto 可转移到当前函数中的标签，常见合理用途是集中释放已部分获得的多项 C 资源。它不能跳转到另一个函数。", "if (!buffer) goto cleanup;\n/* work */\ncleanup:\nfree(buffer);", "避免跳入尚未正确初始化的复杂作用域；标签化清理应保持单向且易追踪。"),
    keyword("if", "/\u026af/", "伊夫", "流程控制", 1, "根据标量条件选择是否执行语句。", "if 将条件与零比较：非零为真，零为假。条件可以是整数、浮点或指针等标量表达式，不限于 _Bool。", "if (pointer != NULL) {\n    use(pointer);\n}", "赋值表达式也可作条件，误写 = 代替 == 可能编译通过并造成严重逻辑错误。"),
    keyword("inline", "/\u02c8\u026anla\u026an/", "因赖恩", "函数", 2, "为函数提供内联替换建议并影响链接规则。", "inline 告诉实现函数适合在调用点展开，但编译器可以忽略性能建议。C 的 inline 还涉及外部定义规则，头文件函数常写成 static inline。", "static inline int square(int x) { return x * x; }", "inline 不保证一定消除函数调用；不要仅凭该关键字判断性能。"),
    keyword("int", "/\u026ant/", "因特", "基础类型", 1, "声明基本有符号整数类型。", "int 至少能表示 -32767 到 32767，实际位宽由实现决定，现代平台通常为 32 位。整数字面量在可表示时优先具有 int 类型。", "int count = 42;", "协议和文件格式需要固定位宽时使用 <stdint.h> 的 int32_t 等类型。"),
    keyword("long", "/l\u0254\u02d0\u014b/", "朗", "基础类型", 1, "扩展整数或浮点类型的范围与精度。", "long int 的范围不小于 int；long double 的精度不低于 double。long 的实际位宽会随数据模型变化，不能假设所有平台都是 64 位。", "long total = 1000000L;\nlong double precise = 1.0L;", "Windows 64 位环境中 long 通常仍为 32 位；跨平台固定位宽应使用 <stdint.h>。"),
    keyword("register", "/\u02c8red\u0292\u026ast\u0259r/", "瑞吉斯特", "存储期", 3, "建议把自动对象放在快速访问位置。", "register 是历史存储类说明符，编译器可以忽略寄存器建议。对 register 对象不能使用取地址运算符，即使实现没有把它放进寄存器。", "register int i;", "现代优化器通常比人工提示更了解寄存器分配；该关键字很少有必要。"),
    keyword("restrict", "/r\u026a\u02c8str\u026akt/", "瑞-斯特里克特", "并发与限定", 3, "承诺指针是访问相关对象的唯一主要路径。", "restrict 是 C99 指针限定符。程序员承诺在限定执行期间遵守无别名规则，编译器因此可进行更积极优化；违反承诺会导致未定义行为。", "void add(size_t n, int *restrict out, const int *restrict in);", "只有真实满足别名约束时才能使用；它是程序员对编译器的契约，不是运行时检查。"),
    keyword("return", "/r\u026a\u02c8t\u025c\u02d0rn/", "瑞-特恩", "流程控制", 1, "结束当前函数并可返回一个值。", "return 立即离开函数。返回表达式会转换为函数声明的返回类型；void 函数可写不带表达式的 return 提前结束。", "int square(int x) {\n    return x * x;\n}", "不要返回指向普通局部自动对象的指针，该对象在函数返回后生命周期已结束。"),
    keyword("short", "/\u0283\u0254\u02d0rt/", "肖特", "基础类型", 1, "声明范围不大于 int 的短有符号整数。", "short int 至少为 16 位，常用于需要紧凑存储或匹配外部二进制布局的场景。算术表达式中 short 通常会整数提升为 int。", "short delta = -120;", "大量算术使用 int 往往更自然；不要假设 short 运算会始终保留 short 类型。"),
    keyword("signed", "/sa\u026and/", "赛恩德", "基础类型", 1, "显式声明有符号整数类型。", "signed 可修饰 char 或与 short、int、long 组合。单独写 signed 等价于 signed int；signed char 是明确有符号的独立字符整数类型。", "signed char sample = -5;\nsigned value = -100;", "普通 char 的有符号性依实现而定，需要明确负值范围时使用 signed char。"),
    keyword("sizeof", "/sa\u026az \u028cv/", "赛兹-奥夫", "内存与类型", 1, "取得类型或对象表示占用的字节数。", "sizeof 的结果类型为 size_t。多数情况下操作数不会被求值；对变长数组类型则可能在运行时计算。字符类型的 sizeof 永远为 1。", "size_t count = sizeof array / sizeof array[0];", "数组传入函数后会退化为指针，此时 sizeof 参数得到的是指针大小而不是原数组长度。", "size of"),
    keyword("static", "/\u02c8st\u00e6t\u026ak/", "斯泰提克", "存储期", 1, "赋予静态存储期或内部链接。", "块内 static 对象在整个程序期间存在但作用域仍局部；文件作用域 static 名称只在当前翻译单元可见。它也常修饰头文件内联函数。", "static unsigned calls;\nstatic void helper(void) { ++calls; }", "函数内静态可变状态会影响重入、线程安全和测试隔离。"),
    keyword("struct", "/str\u028ckt/", "斯特拉克特", "复合类型", 1, "声明由多个具名成员组成的结构类型。", "struct 把不同类型成员顺序组织在一个对象中，成员之间可能插入填充以满足对齐。C 中使用标签名时通常需要写 struct 前缀，除非另建 typedef。", "struct point {\n    int x;\n    int y;\n};", "不要用 memcmp 判断含填充结构体的逻辑相等；填充字节可能具有不确定值。"),
    keyword("switch", "/sw\u026at\u0283/", "斯维奇", "流程控制", 1, "按整数或枚举值选择分支入口。", "switch 对整型提升后的控制表达式求值一次，再跳到匹配 case 或 default。执行会继续经过后续标签，直到 break 或语句结束。", "switch (command) {\ncase 'q': quit(); break;\ndefault: help();\n}", "每个 case 值必须唯一且能转换为控制表达式提升后的类型。"),
    keyword("typedef", "/\u02c8ta\u026apdef/", "泰普-德夫", "复合类型", 1, "为现有类型创建别名名称。", "typedef 不创建新类型，只给已有类型或复杂声明提供另一个名字。它常用于结构体别名、函数指针和平台抽象。", "typedef unsigned long user_id;\ntypedef void (*callback)(int);", "别名会隐藏指针星号等细节；例如 typedef 指针再加 const 时，const 限定的是指针本身。", "type def"),
    keyword("union", "/\u02c8ju\u02d0ni\u0259n/", "尤尼恩", "复合类型", 2, "声明多个成员共享同一段存储的联合类型。", "union 的大小足以容纳最大成员，但同一时刻只有一个成员的存储表示处于活动使用语境。它常用于节省空间和表达带标签变体。", "union number {\n    int i;\n    double d;\n};", "读取与最近写入成员不同的成员涉及严格的标准规则和可移植性风险；最好配合显式标签。"),
    keyword("unsigned", "/\u028cn\u02c8sa\u026and/", "安-赛恩德", "基础类型", 1, "声明只表示非负值并按模运算的整数类型。", "unsigned 可与 char、short、int、long 组合。无符号算术按 2 的位宽次方取模，因此溢出有明确定义，但与有符号值混算可能产生意外转换。", "unsigned int mask = 0xffu;", "倒序循环和差值计算要小心无符号下溢，它不会变成负数而会回绕到大值。"),
    keyword("void", "/v\u0254\u026ad/", "沃伊德", "基础类型", 1, "表示无返回值、不完整无类型对象或通用对象指针。", "函数返回 void 表示不返回结果。void * 可以保存任意对象指针并在 C 中自动相互转换，但解引用前必须转换到完整对象类型。", "void log_message(const char *text);\nvoid *memory = malloc(128);", "void * 不保存所指对象的类型和长度；调用者必须维护正确的转换与生命周期。"),
    keyword("volatile", "/\u02c8v\u0251\u02d0l\u0259t\u0259l/", "沃拉泰尔", "并发与限定", 2, "表示对象可能被当前执行流之外的因素改变。", "volatile 要求实现保留对对象的可观察访问，常用于内存映射硬件或信号处理相关对象。它不提供线程间原子性或完整内存同步。", "volatile unsigned int *status = DEVICE_STATUS;", "多线程同步应使用 _Atomic 或平台同步原语；volatile 不能替代互斥量。"),
    keyword("while", "/wa\u026al/", "外尔", "流程控制", 1, "在标量条件非零时重复执行循环体。", "while 在每轮开始前判断条件，因此可能一次也不执行。条件中的副作用会在每轮判断时发生。", "while ((ch = getchar()) != EOF) {\n    putchar(ch);\n}", "确保循环能推进到终止条件，并区分赋值作为有意条件与误写比较。")
  ];

  window.LANGUAGE_BANKS = window.LANGUAGE_BANKS || {};
  window.LANGUAGE_BANKS.c = {
    id: "c",
    name: "C",
    standard: "C17 · 44 个关键字",
    keywords,
    reserved: keywords.map(item => item.w),
    contextual: []
  };
})();
