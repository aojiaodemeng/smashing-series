## XSS 攻击 | 跨站脚本攻击

- XSS： 全称是 Cross-site scripting，跨站脚本攻击
  - 侧重于脚本，千方百计的注入并执行恶意脚本
- CSRF： 全称是 Cross-site request forgery，跨站请求伪造
  - 不注入恶意脚本，侧重于请求伪造，借刀杀人，在用户不知情的情况下，借用户的名义干坏事

### 1.XSS 攻击危害

- 窃取页面数据，如 DOM、cookie、localStorage，然后进一步执行 CSRF 攻击
- 截取流量，然后导流到黑客自己设定的网站去
- 插入恶意广告
- 置入木马
- 获取用户信息

主要通过 url 参数注入、输入框注入等方式，也就是说一切用户输入的地方都是可攻击的地方，

### 2.攻击类型

![](./img/xss-type.png)

- 反射型和 DOM 型主要是通过 URL 参数的方式注入，也就是说黑客会引诱用户点击带有恶意代码的链接。
- 反射型和 DOM 型的区别是，反射型是服务端返回的代码中包含恶意代码，而对于 DOM 型，服务端返回代码是正常的；反射型是恶意代码从客户端到服务端，然后再由服务端返回给客户端，DOM 型是恶意代码一直存在客户端
- 储存型的常用攻击方式是在输入框输入恶意代码，然后点击提交，就会提交到服务端，服务端将恶意代码存储到数据库，之后用户每次访问都会拉取到恶意代码并执行，所以带来的危害是最持久的

### 3.如何防御 XSS 攻击

攻击过程是先注入再执行，所以要防止注入并防止执行，要对用户的输入和输出做严格的把控，所以对输入进行过滤，对输出进行转义。

预防方案：

![](./img/xss-methods.png)

为什么要限制输入长度？ —— 因为恶意代码一般比较长，限制长度会增加攻击难度

## CSRF 攻击 | 跨站请求伪造

跨站请求伪造（英语：Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF。

一个正常的请求会将合法用户的 session id 保存到浏览器的 cookie。这时候，如果用户在浏览器中打开另一个 tab 页，那这个 tab 页也是可以获得浏览器的 cookie，黑客就可以利用这个 cookie 信息进行攻击。

### 1.攻击类型

- `GET 类型的 CSRF`：在网站中的一个 img 标签里构建一个 src，当用户访问了含有这个 img 的页面后，浏览器会自动向这个网站链接发出一次 HTTP 请求，网站就会收到包含受害者登录信息的一次跨域请求
  ```html
  <img src="http://bank.example/withdraw?amount=10000&for=hacker" />
  ```
- `POST 类型的 CSRF 攻击`：构建一个表单，然后隐藏它，当用户进入页面时，自动提交这个表单，相当于模拟用户完成了一次 POST 操作
  ```html
  <form action="http://bank.example/withdraw" method="POST">
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
  </form>
  <script>
    document.forms[0].submit();
  </script>
  ```
- `链接类型的CSRF`：链接类型的 CSRF 并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击
  ```html
  <a
    href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker"
    taget="_blank"
    >重磅消息！！<a
  /></a>
  ```

攻击过程：

- 1.某银行网站 A 可以以 GET 请求方式发起转账操作。www.xxx.com/transfor.do?accountNum=100&money=1000，accountNum表示目标账户。这个请求肯定是需要登陆才可以正常访问的。
- 2.攻击者在某个论坛或网站上，上传一个图片，链接地址是www.xxx.com/transfor.do?accountNum=100&money=1000，accountNum是攻击者自己的银行账户
- 3.如果有一个用户，登陆了银行网站，然后又打开浏览器的另一个 tab 页，点击了这个图片，这是，银行就会受理到一个带了正确 cookie 的请求，就会完成转账，用户的钱就被盗了

### 2.如何防御 CSRF 攻击

#### 2-1.同源检测

服务器根据 http 请求头中 origin 或者 referer 信息来判断请求是否为允许访问的站点，从而对请求进行过滤。当 origin 或者 referer 信息都不存在的时候，直接阻止请求。这种方式的缺点是有些情况下 referer 可以被伪造，同时还会把搜索引擎的链接也给屏蔽了。所以一般网站会允许搜索引擎的页面请求，但是相应的页面请求这种请求方式也可能被攻击者给利用。（Referer 字段代表请求的来源）

#### 2-2.设置 SameSite 属性为 Strict

SameSite 可以设置为三个值，Strict、Lax 和 None：

- Strict 模式下，浏览器完全禁⽌第三⽅请求携带 Cookie。⽐如请求 sanyuan.com ⽹站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他⽹站请求都不能。
- Lax 模式，宽松⼀点，但是只能在 get ⽅法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。
- None 模式下，也就是默认模式，请求会⾃动携带上 Cookie。

```js
response.setHeader('Set-Cookie', 'sessionId=xxx;SameSite=Strict'); // 设置SameSite属性为Strict
// 使用SameSite属性可以限制Cookie只能在同一站点内进行请求，防止攻击者盗用Cookie进行跨站请求。
```

#### 2-3.验证码

在一些关键操作（如支付、修改密码等）中，可以添加验证码验证，确保用户是真实操作。例如密码、短信验证码、指纹等等，强制用户必须与应用进行交互，才能完成最终请求。这种方式能很好的遏制 csrf ，但是用户体验相对会比较差。

#### 2-4.token

token 是最普遍的一种防御方法，后端先生成一个 token ，之后将此放在数据库中并发送给前端，那么前端发送请求时就会携带这个 token ，后端通过校验这个 token 和数据库中的 token 是否一致，以此来判断是否是本网站的请求。

:::success{title=示例}
用户登录输入账号密码，请求登录接口，后端在用户登录信息正确的情况下将 token 放到数据库中，并返回 token 给前端，前端把 token 存放在 localstorage 中，之后再发送请求都会将 token 放到 header 中。
后端写一个过滤器，拦截 POST 请求，注意忽略掉不需要 token 的请求，比如登录接口，获取 token 的接口，以免还没有获取 token 就开始检验 token 。
校验原则：数据库中的 token 和前端 header 中的 token 一致的 post 请求，则说明校验成功，给客户端放行。
:::

## CSRF 与 XSS 区别

- 通常来说 CSRF 是由 XSS 实现的，CSRF 时常也被称为 XSRF（CSRF 实现的方式还可以是直接通过命令行发起请求等）。
- 本质上讲，XSS 是代码注入问题，CSRF 是 HTTP 问题。 XSS 是内容没有过滤导致浏览器将攻击者的输入当代码执行，CSRF 则是浏览器在发送 HTTP 请求时候进行。

## 为什么 Cookie 无法防止 XSRF，而 token 可以

- cookie 是同源的，跨域请求不会自动携带 cookie
- token 不像是 cookie 自动附加到请求头中的，token 需要我们手动设置到请求头中，不设置是没有的
- token 防止 XSRF 的前提是，不把 token 存储在 cookie 里

## referer 和 origin 区别

![](./img/referer-origin.png)

### Origin

Origin 批示了申请来自于哪个站点，只有服务器名，不蕴含门路信息，浏览器主动增加到 http 申请 Header 中，无需手动设置。

#### 增加 ORIGIN 的状况

- 同源申请：POST、OPTIONS、PUT、PATCH 和 DELETE 申请都会增加 Origin 申请头，GET 或 HEAD 申请不会增加 Origin 申请头。
- 跨域申请：所有跨域申请(CORS)都会增加 Origin 申请头。

#### 用法

语法：

```
Origin: <scheme> "://" <host> [ ":" <port> ]

举个例子：
Origin: https://developer.mozilla.org
```

参数：

- `<scheme>`:申请所应用协定，通常是 HTTP 或者 HTTPS
- `<host>`:服务器的 域名 或 IP
- `<port>`:可选，端口号，HTTP 申请，默认端口为 80

### Referer

Referer 批示了申请来自于哪个具体页面，蕴含服务器名和门路的具体 URL，浏览器主动增加到 http 申请 Header 中，无需手动设置。

#### 不会增加 Referer 的状况

- 起源页面采纳 file 或 data URI 协定；
- 起源页面采纳 HTTPS 协定，而申请页面采纳 HTTP 协定；

#### 用法

语法：

```
Referer: <url>

举个例子：
Referer: https://developer.mozilla.org/en-US/docs/Web/JavaScript
```

参数：

- `url` ：示意申请起源页面的绝对路径或者相对路径，但不蕴含 URL fragments (例如 "#section") 和 userinfo (例如 "https://username:password@example.com/foo/bar/" 中的 "username:password" )
