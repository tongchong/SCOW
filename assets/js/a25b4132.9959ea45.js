"use strict";(self.webpackChunk_scow_docs=self.webpackChunk_scow_docs||[]).push([[9263],{4852:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(9231);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=l(n),f=o,m=d["".concat(p,".").concat(f)]||d[f]||s[f]||a;return n?r.createElement(m,i(i({ref:t},u),{},{components:n})):r.createElement(m,i({ref:t},u))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4038:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>s,frontMatter:()=>a,metadata:()=>c,toc:()=>l});var r=n(9675),o=(n(9231),n(4852));const a={sidebar_position:1,title:"\u7b80\u4ecb"},i="\u8ba4\u8bc1\u7cfb\u7edf\u7b80\u4ecb",c={unversionedId:"deploy/config/auth/intro",id:"deploy/config/auth/intro",title:"\u7b80\u4ecb",description:"\u8ba4\u8bc1\u7cfb\u7edf(auth)\u4e3a\u7cfb\u7edf\u63d0\u4f9b\u7528\u6237\u767b\u5f55\u529f\u80fd\uff0c\u4ee5\u53ca\u4e3a\u5404\u4e2a\u7ec4\u4ef6\u63d0\u4f9b\u9274\u6743\u670d\u52a1\u3002",source:"@site/docs/deploy/config/auth/intro.md",sourceDirName:"deploy/config/auth",slug:"/deploy/config/auth/intro",permalink:"/SCOW/docs/deploy/config/auth/intro",draft:!1,editUrl:"https://github.com/PKUHPC/SCOW/edit/main/website/docs/deploy/config/auth/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"\u7b80\u4ecb"},sidebar:"deploy",previous:{title:"\u8ba4\u8bc1",permalink:"/SCOW/docs/category/\u8ba4\u8bc1"},next:{title:"SSH",permalink:"/SCOW/docs/deploy/config/auth/ssh"}},p={},l=[],u={toc:l};function s(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"\u8ba4\u8bc1\u7cfb\u7edf\u7b80\u4ecb"},"\u8ba4\u8bc1\u7cfb\u7edf\u7b80\u4ecb"),(0,o.kt)("p",null,"\u8ba4\u8bc1\u7cfb\u7edf(",(0,o.kt)("inlineCode",{parentName:"p"},"auth"),")\u4e3a\u7cfb\u7edf\u63d0\u4f9b\u7528\u6237\u767b\u5f55\u529f\u80fd\uff0c\u4ee5\u53ca\u4e3a\u5404\u4e2a\u7ec4\u4ef6\u63d0\u4f9b\u9274\u6743\u670d\u52a1\u3002"),(0,o.kt)("h1",{id:"\u5185\u7f6e\u8ba4\u8bc1\u7cfb\u7edf"},"\u5185\u7f6e\u8ba4\u8bc1\u7cfb\u7edf"),(0,o.kt)("p",null,"\u6211\u4eec\u63d0\u4f9b\u7684\u8ba4\u8bc1\u7cfb\u7edf\u5b9e\u73b0\u652f\u6301\u4ee5\u4e0b\u8ba4\u8bc1\u65b9\u5f0f\u3002\u8bf7\u6839\u636e\u81ea\u5df1\u7684\u96c6\u7fa4\u7684\u60c5\u51b5\uff0c\u9009\u62e9\u81ea\u5df1\u7684\u8ba4\u8bc1\u65b9\u5f0f\u5e76\u8fdb\u884c\u90e8\u7f72\u548c\u914d\u7f6e\u3002"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/SCOW/docs/deploy/config/auth/ssh"},"SSH")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/SCOW/docs/deploy/config/auth/ldap"},"LDAP"))),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"\u5982\u679c\u60a8\u7684\u96c6\u7fa4\u53ef\u4ee5\u4f7f\u7528SSH\u767b\u5f55\uff0c\u53ef\u4ee5\u9996\u5148\u4f7f\u7528\u6700\u7b80\u5355\u7684SSH\u65b9\u5f0f\u8fdb\u884c\u6d4b\u8bd5\u3002")),(0,o.kt)("p",null,"\u5185\u7f6e\u7cfb\u7edf\u7684\u989d\u5916\u914d\u7f6e\u4ecb\u7ecd\u8bf7\u53c2\u8003",(0,o.kt)("a",{parentName:"p",href:"/SCOW/docs/deploy/config/auth/config"},"\u5185\u7f6e\u8ba4\u8bc1\u7cfb\u7edf\u914d\u7f6e")),(0,o.kt)("h1",{id:"\u81ea\u5b9a\u4e49\u8ba4\u8bc1\u65b9\u5f0f"},"\u81ea\u5b9a\u4e49\u8ba4\u8bc1\u65b9\u5f0f"),(0,o.kt)("p",null,"\u5982\u679c\u60a8\u7684\u96c6\u7fa4\u9700\u8981\u4f7f\u7528\u5176\u4ed6\u8ba4\u8bc1\u65b9\u5f0f\uff0c\u60a8\u53ef\u4ee5\u53c2\u8003\u6587\u6863\u53bb",(0,o.kt)("a",{parentName:"p",href:"/SCOW/docs/deploy/config/auth/use-custom-auth"},"\u4f7f\u7528"),"\u6216\u8005",(0,o.kt)("a",{parentName:"p",href:"/SCOW/docs/deploy/config/auth/impl-custom-auth"},"\u5b9e\u73b0"),"\u4e00\u4e2a\u81ea\u5b9a\u4e49\u8ba4\u8bc1\u7cfb\u7edf\u3002"))}s.isMDXComponent=!0}}]);