(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1022:function(e,t){},1256:function(e,t){},1280:function(e,t){},1315:function(e,t){},1367:function(e,t){},1369:function(e,t){},1381:function(e,t){},1543:function(e,t){},1554:function(e,t){},1556:function(e,t){},1584:function(e,t){},1600:function(e,t){},1633:function(e,t){},1720:function(e,t,n){},1732:function(e,t,n){"use strict";n.r(t);var a=n(2),o=n.n(a),l=n(186),i=n.n(l),r=(n(722),n(257)),c=n(258),u=n(264),s=n(259),d=n(265),f=n(1),h=n.n(f),m=n(705),p=n(1737),v=n(1738),E=n(1739),b=n(1740);function w(e,t){return o.a.createElement(p.a,{fluid:!0},o.a.createElement(v.a,null,"Idea Hub: ",o.a.createElement("small",null,"Submit and view ideas in OSO Idea Network")),o.a.createElement(E.a,{defaultActiveKey:1,id:"uncontrolled-tab-example"},o.a.createElement(b.a,{eventKey:1,title:"Submit an Idea"},o.a.createElement(m.a,null)),o.a.createElement(b.a,{eventKey:2,title:"View your Ideas"},"Tab 2 content"),o.a.createElement(b.a,{eventKey:3,title:"Explore the Idea network"},"Tab 3 content")))}w.contextTypes={web3:h.a.object};var S=w,I=(n(1720),function(e){function t(){return Object(r.a)(this,t),Object(u.a)(this,Object(s.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return o.a.createElement("div",{className:"App"},o.a.createElement(S,null))}}]),t}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var g=n(713);i.a.render(o.a.createElement(g.Web3Provider,null,o.a.createElement(I,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},470:function(e,t){},705:function(e,t,n){"use strict";(function(e){var a=n(257),o=n(258),l=n(264),i=n(259),r=n(265),c=n(129),u=n(2),s=n.n(u),d=n(1),f=n.n(d),h=n(706),m=n.n(h),p=n(714),v=n(1733),E=n(715),b=n(1734),w=n(1735),S=n(1736),I=function(t){function n(e,t){var o;return Object(a.a)(this,n),(o=Object(l.a)(this,Object(i.a)(n).call(this,e))).handleChange=o.handleChange.bind(Object(c.a)(Object(c.a)(o))),o.uploadIdeaTextToIPFS=o.uploadIdeaTextToIPFS.bind(Object(c.a)(Object(c.a)(o))),o.ipfsNode=new m.a({repo:String(Math.random()+Date.now())}),o.state={ipfsOptions:{id:null,version:null,protocol_version:null},value:"",added_file_hash:"",added_file_contents:""},o}return Object(r.a)(n,t),Object(o.a)(n,[{key:"uploadIdeaTextToIPFS",value:function(){var t=this;this.ipfsNode.files.add([e.from(this.state.value)],function(e,n){if(e)throw e;var a=n[0].hash;t.ipfsNode.files.cat(a,function(e,n){if(e)throw e;t.setState({added_file_hash:a,added_file_contents:n.toString()})})})}},{key:"componentDidMount",value:function(){var e=this;this.ipfsNode.once("ready",function(){e.ipfsNode.id(function(t,n){if(t)throw t;e.setState({ipfsOptions:{id:n.id,version:n.agentVersion,protocol_version:n.protocolVersion}})})})}},{key:"getValidationState",value:function(){var e=this.state.value.length;return e>10?"success":e>5?"warning":e>0?"error":null}},{key:"handleChange",value:function(e){this.setState({value:e.target.value})}},{key:"render",value:function(){return s.a.createElement("div",{style:{textAlign:"center"}},s.a.createElement("h1",null,"Connected to ethereum and ipfs network!"),s.a.createElement("p",null,"Ethereum network: ",this.context.web3.network),s.a.createElement("p",null,"Your IPFS version is ",s.a.createElement("strong",null,this.state.ipfsOptions.version)),s.a.createElement("p",null,"Your IPFS protocol version is ",s.a.createElement("strong",null,this.state.ipfsOptions.protocol_version)),s.a.createElement("hr",null),s.a.createElement("p",null,"Using your ethereum account: ",this.context.web3.selectedAccount),s.a.createElement("p",null,"Your IPFS ID is ",s.a.createElement("strong",null,this.state.ipfsOptions.id)),s.a.createElement("hr",null),s.a.createElement("p",null,"Submitted Idea's IPFS hash: ",this.state.added_file_hash),s.a.createElement("p",null,"Submitted Idea's content: ",this.state.added_file_contents),s.a.createElement("p",null,"Checkout the uploaded idea at: ","https://ipfs.io/ipfs","/",this.state.added_file_hash),s.a.createElement("hr",null),s.a.createElement("form",null,s.a.createElement(p.a,{controlId:"formBasicText",validationState:this.getValidationState()},s.a.createElement(v.a,null,"Submit an Idea text to OSO Idea network"),s.a.createElement(E.a,{type:"text",bsSize:"small",value:this.state.value,placeholder:"Enter text",onChange:this.handleChange}),s.a.createElement(E.a.Feedback,null),s.a.createElement(b.a,null,"String should be more than 10 characters long.")),s.a.createElement(p.a,null,s.a.createElement(w.a,{smOffset:2,sm:10},s.a.createElement(S.a,{onClick:this.uploadIdeaTextToIPFS},"Submit Idea")))))}}]),n}(s.a.Component);I.contextTypes={web3:f.a.object},t.a=I}).call(this,n(0).Buffer)},717:function(e,t,n){e.exports=n(1732)},722:function(e,t,n){},808:function(e,t){},810:function(e,t){},898:function(e,t){},909:function(e,t){}},[[717,2,1]]]);
//# sourceMappingURL=main.cf16fb88.chunk.js.map