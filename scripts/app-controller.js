!function e(t,n,r){function i(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};t[s][0].call(l.exports,function(e){var n=t[s][1][e];return i(n?n:e)},l,l.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(t,n){var i=this;return r(this,e),this._stateChangeCb=t,this._subscriptionUpdate=n,this._state={UNSUPPORTED:{id:"UNSUPPORTED",interactive:!1,pushEnabled:!1},INITIALISING:{id:"INITIALISING",interactive:!1,pushEnabled:!1},PERMISSION_DENIED:{id:"PERMISSION_DENIED",interactive:!1,pushEnabled:!1},PERMISSION_GRANTED:{id:"PERMISSION_GRANTED",interactive:!0},PERMISSION_PROMPT:{id:"PERMISSION_PROMPT",interactive:!0,pushEnabled:!1},ERROR:{id:"ERROR",interactive:!1,pushEnabled:!1},STARTING_SUBSCRIBE:{id:"STARTING_SUBSCRIBE",interactive:!1,pushEnabled:!0},SUBSCRIBED:{id:"SUBSCRIBED",interactive:!0,pushEnabled:!0},STARTING_UNSUBSCRIBE:{id:"STARTING_UNSUBSCRIBE",interactive:!1,pushEnabled:!1},UNSUBSCRIBED:{id:"UNSUBSCRIBED",interactive:!0,pushEnabled:!1}},"serviceWorker"in navigator&&"PushManager"in window&&"showNotification"in ServiceWorkerRegistration.prototype?void navigator.serviceWorker.ready.then(function(){i._stateChangeCb(i._state.INITIALISING),i.setUpPushPermission()}):void this._stateChangeCb(this._state.UNSUPPORTED)}return i(e,[{key:"_permissionStateChange",value:function(e){switch(e){case"denied":this._stateChangeCb(this._state.PERMISSION_DENIED);break;case"granted":this._stateChangeCb(this._state.PERMISSION_GRANTED);break;case"default":this._stateChangeCb(this._state.PERMISSION_PROMPT);break;default:console.error("Unexpected permission state: ",e)}}},{key:"setUpPushPermission",value:function(){var e=this;return this._permissionStateChange(Notification.permission),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){t&&(e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t))})["catch"](function(t){console.log(t),e._stateChangeCb(e._state.ERROR,t)})}},{key:"subscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_SUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.subscribe({userVisibleOnly:!0})}).then(function(t){e._stateChangeCb(e._state.SUBSCRIBED),e._subscriptionUpdate(t)})["catch"](function(t){e._permissionStateChange(Notification.permission),"denied"!==Notification.permission&&"default"!==Notification.permission&&e._stateChangeCb(e._state.ERROR,t)})}},{key:"unsubscribeDevice",value:function(){var e=this;this._stateChangeCb(this._state.STARTING_UNSUBSCRIBE),navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(t){return t?t.unsubscribe().then(function(e){e||console.error("We were unable to unregister from push")}):(e._stateChangeCb(e._state.UNSUBSCRIBED),void e._subscriptionUpdate(null))}).then(function(){e._stateChangeCb(e._state.UNSUBSCRIBED),e._subscriptionUpdate(null)})["catch"](function(e){console.error("Error thrown while revoking push notifications. Most likely because push was never registered",e)})}}]),e}(),s=function(){function e(t){r(this,e),this._ikm=t}return i(e,[{key:"sign",value:function(e){return crypto.subtle.importKey("raw",this._ikm,{name:"HMAC",hash:"SHA-256"},!1,["sign"]).then(function(t){return crypto.subtle.sign("HMAC",t,e)})}}]),e}();"undefined"!=typeof window&&(window.gauntface=window.gauntface||{},window.gauntface.HMAC=s);var a=function(){function e(t,n){r(this,e),this._ikm=t,this._salt=n,this._hmac=new s(n)}return i(e,[{key:"generate",value:function(e,t){var n=new Uint8Array(e.byteLength+1);return n.set(e,0),n.set(new Uint8Array(1).fill(1),e.byteLength),this._hmac.sign(this._ikm).then(function(e){var t=new s(e);return t.sign(n)}).then(function(e){return e.slice(0,t)})}}]),e}();"undefined"!=typeof window&&(window.gauntface=window.gauntface||{},window.gauntface.HKDF=a);var u=32,c=65,l=16,h=function(e){return e.reduce(function(e,t){var n=new Uint8Array(e.byteLength+t.byteLength);return n.set(e,0),n.set(t,e.byteLength),n},new Uint8Array)},p=function(){function e(t,n){if(r(this,e),!t||!t.publicKey||!t.privateKey)throw new Error("Bad server keys. Use EncryptionHelperFactory.generateKeys()");if(!n)throw new Error("Bad salt value. Use EncryptionHelperFactory.generateSalt()");this._serverKeys=t,this._salt=n}return i(e,[{key:"getPublicServerKey",value:function(){return this._serverKeys.publicKey}},{key:"getPrivateServerKey",value:function(){return this._serverKeys.privateKey}},{key:"getSharedSecret",value:function(t){var n=this;return Promise.resolve().then(function(){return e.stringKeysToCryptoKeys(t)}).then(function(e){return e.publicKey}).then(function(e){if(!(e instanceof CryptoKey))throw new Error("The publicKey must be a CryptoKey.");var t={name:"ECDH",namedCurve:"P-256","public":e};return crypto.subtle.deriveBits(t,n.getPrivateServerKey(),256)})}},{key:"getSalt",value:function(){return this._salt}},{key:"generateContext",value:function(t){var n=this;return Promise.resolve().then(function(){return e.stringKeysToCryptoKeys(t)}).then(function(t){return e.exportCryptoKeys(t.publicKey).then(function(e){return e.publicKey})}).then(function(t){return e.exportCryptoKeys(n.getPublicServerKey()).then(function(e){return{clientPublicKey:t,serverPublicKey:e.publicKey}})}).then(function(e){var t=new TextEncoder("utf-8"),n=t.encode("P-256"),r=new Uint8Array(1).fill(0),i=new Uint8Array(2);i[0]=0,i[1]=e.clientPublicKey.byteLength;var o=new Uint8Array(2);return o[0]=0,o[1]=e.serverPublicKey.byteLength,h([n,r,i,e.clientPublicKey,o,e.serverPublicKey])})}},{key:"generateCEKInfo",value:function(e){var t=this;return Promise.resolve().then(function(){var n=new TextEncoder("utf-8"),r=n.encode("Content-Encoding: aesgcm"),i=new Uint8Array(1).fill(0);return t.generateContext(e).then(function(e){return h([r,i,e])})})}},{key:"generateNonceInfo",value:function(e){var t=this;return Promise.resolve().then(function(){var n=new TextEncoder("utf-8"),r=n.encode("Content-Encoding: nonce"),i=new Uint8Array(1).fill(0);return t.generateContext(e).then(function(e){return h([r,i,e])})})}},{key:"generatePRK",value:function(t){return this.getSharedSecret(t.keys.p256dh).then(function(n){var r=new TextEncoder("utf-8"),i=r.encode("Content-Encoding: auth\x00"),o=new a(n,e.base64UrlToUint8Array(t.keys.auth));return o.generate(i,32)})}},{key:"generateEncryptionKeys",value:function(e){var t=this;return Promise.all([this.generatePRK(e),this.generateCEKInfo(e.keys.p256dh),this.generateNonceInfo(e.keys.p256dh)]).then(function(e){var n=e[0],r=e[1],i=e[2],o=new a(n,t._salt),s=new a(n,t._salt);return Promise.all([o.generate(r,16),s.generate(i,12)])}).then(function(e){return{contentEncryptionKey:e[0],nonce:e[1]}})}},{key:"encryptMessage",value:function(t,n){var r=this;return this.generateEncryptionKeys(t).then(function(e){return crypto.subtle.importKey("raw",e.contentEncryptionKey,"AES-GCM",!0,["decrypt","encrypt"]).then(function(t){return e.contentEncryptionCryptoKey=t,e})}).then(function(e){var t=0,r=new Uint8Array(2+t),i=new TextEncoder("utf-8"),o=i.encode(n),s=new Uint8Array(r.byteLength+o.byteLength);s.set(r,0),s.set(o,r.byteLength);var a={name:"AES-GCM",tagLength:128,iv:e.nonce};return crypto.subtle.encrypt(a,e.contentEncryptionCryptoKey,s)}).then(function(t){return e.exportCryptoKeys(r.getPublicServerKey()).then(function(n){return{cipherText:t,salt:e.uint8ArrayToBase64Url(r.getSalt()),publicServerKey:e.uint8ArrayToBase64Url(n.publicKey)}})})}}],[{key:"exportCryptoKeys",value:function(t,n){return Promise.resolve().then(function(){var r=[];return r.push(crypto.subtle.exportKey("jwk",t).then(function(t){var n=e.base64UrlToUint8Array(t.x),r=e.base64UrlToUint8Array(t.y),i=new Uint8Array(65);return i.set([4],0),i.set(n,1),i.set(r,33),i})),n&&r.push(crypto.subtle.exportKey("jwk",n).then(function(t){return e.base64UrlToUint8Array(t.d)})),Promise.all(r)}).then(function(e){var t={publicKey:e[0]};return e.length>1&&(t.privateKey=e[1]),t})}},{key:"stringKeysToCryptoKeys",value:function(t,n){if("string"!=typeof t)throw new Error("The publicKey is expected to be an String.");var r=e.base64UrlToUint8Array(t);if(r.byteLength!==c)throw new Error("The publicKey is expected to be "+c+" bytes.");var i=new Uint8Array(r);if(4!==i[0])throw new Error("The publicKey is expected to start with an 0x04 byte.");var o={kty:"EC",crv:"P-256",x:e.uint8ArrayToBase64Url(i,1,33),y:e.uint8ArrayToBase64Url(i,33,65),ext:!0},s=[];if(s.push(crypto.subtle.importKey("jwk",o,{name:"ECDH",namedCurve:"P-256"},!0,[])),n){if("string"!=typeof n)throw new Error("The privateKey is expected to be an String.");var a=e.base64UrlToUint8Array(n);if(a.byteLength!==u)throw new Error("The privateKey is expected to be "+u+" bytes.");o.d=e.uint8ArrayToBase64Url(new Uint8Array(a)),s.push(crypto.subtle.importKey("jwk",o,{name:"ECDH",namedCurve:"P-256"},!0,["deriveBits"]))}return Promise.all(s).then(function(e){var t={publicKey:e[0]};return e.length>1&&(t.privateKey=e[1]),t})}},{key:"uint8ArrayToBase64Url",value:function(e,t,n){t=t||0,n=n||e.byteLength;var r=btoa(String.fromCharCode.apply(null,e.slice(t,n)));return r.replace(/\=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}},{key:"base64UrlToUint8Array",value:function(e){for(var t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),i=new Uint8Array(r.length),o=0;o<r.length;++o)i[o]=r.charCodeAt(o);return i}}]),e}(),y=function(){function e(){r(this,e)}return i(e,null,[{key:"generateHelper",value:function(t){return Promise.resolve().then(function(){return t&&t.serverKeys?e.importKeys(t):e.generateKeys(t)}).then(function(e){var n=null;return n=t&&t.salt?p.base64UrlToUint8Array(t.salt):crypto.getRandomValues(new Uint8Array(16)),new p(e,n)})}},{key:"importKeys",value:function(e){return e&&e.serverKeys&&e.serverKeys.publicKey&&e.serverKeys.privateKey?Promise.resolve().then(function(){return p.stringKeysToCryptoKeys(e.serverKeys.publicKey,e.serverKeys.privateKey)}):Promise.reject(new Error("Bad options for key import"))}},{key:"generateKeys",value:function(){return crypto.subtle.generateKey({name:"ECDH",namedCurve:"P-256"},!0,["deriveBits"])}},{key:"generateSalt",value:function(){return crypto.getRandomValues(new Uint8Array(l))}}]),e}();"undefined"!=typeof window&&(window.gauntface=window.gauntface||{},window.gauntface.EncryptionHelperFactory=y,window.gauntface.EncryptionHelper=p);var d=function(){function e(){var t=this;r(this,e),this._PUSH_SERVER_URL="",this._API_KEY="AIzaSyBBh4ddPa96rQQNxqiq_qQj7sq1JdsNQUQ",this._sendPushOptions=document.querySelector(".js-send-push-options"),this._payloadTextField=document.querySelector(".js-payload-textfield"),this._stateMsg=document.querySelector(".js-state-msg"),this._payloadTextField.oninput=function(){Promise.all([t.updateCurlCommand(),t.updateXHRButton()]).then(function(){t.updateOrMessage()})};var n=document.querySelector(".js-push-toggle-switch");n.classList.contains("is-upgraded")?(this.ready=Promise.resolve(),this._uiInitialised(n.MaterialSwitch)):this.ready=new Promise(function(e){var r=function i(){n.classList.contains("is-upgraded")&&(t._uiInitialised(n.MaterialSwitch),document.removeEventListener(i),e())};document.addEventListener("mdl-componentupgraded",r)})}return i(e,[{key:"_uiInitialised",value:function(e){var t=this;this._stateChangeListener=this._stateChangeListener.bind(this),this._subscriptionUpdate=this._subscriptionUpdate.bind(this),this._toggleSwitch=e,this._pushClient=new o(this._stateChangeListener,this._subscriptionUpdate),document.querySelector(".js-push-toggle-switch > input").addEventListener("click",function(e){e.target.checked?t._pushClient.subscribeDevice():t._pushClient.unsubscribeDevice()});var n=document.querySelector(".js-send-push-button");n.addEventListener("click",function(){t._currentSubscription&&t.sendPushMessage(t._currentSubscription,t._payloadTextField.value)})}},{key:"registerServiceWorker",value:function(){var e=this;"serviceWorker"in navigator?navigator.serviceWorker.register("./service-worker.js")["catch"](function(t){e.showErrorMessage("Unable to Register SW","Sorry this demo requires a service worker to work and it was didn't seem to install - sorry :("),console.error(t)}):this.showErrorMessage("Service Worker Not Supported","Sorry this demo requires service worker support in your browser. Please try this demo in Chrome or Firefox Nightly.")}},{key:"_stateChangeListener",value:function(e,t){switch("undefined"!=typeof e.interactive&&(e.interactive?this._toggleSwitch.enable():this._toggleSwitch.disable()),"undefined"!=typeof e.pushEnabled&&(e.pushEnabled?this._toggleSwitch.on():this._toggleSwitch.off()),e.id){case"ERROR":this.showErrorMessage("Ooops a Problem Occurred",t)}}},{key:"_subscriptionUpdate",value:function(e){var t=this;if(this._currentSubscription=e,!e)return void(this._sendPushOptions.style.opacity=0);var n=document.querySelector(".js-payload-textfield-container"),r=JSON.parse(JSON.stringify(e));r&&r.keys&&r.keys.auth&&r.keys.p256dh?n.classList.remove("hidden"):n.classList.add("hidden"),Promise.all([this.updateCurlCommand(),this.updateXHRButton()]).then(function(){t.updateOrMessage()}),this._sendPushOptions.style.opacity=1}},{key:"updateCurlCommand",value:function(){var e=this,t=this._payloadTextField.value,n=Promise.resolve(null);return t&&t.trim().length>0&&(n=y.generateHelper().then(function(n){return n.encryptMessage(JSON.parse(JSON.stringify(e._currentSubscription)),t)})),n.then(function(n){var r=document.querySelector(".js-curl-container"),i=void 0;if(0===e._currentSubscription.endpoint.indexOf("https://android.googleapis.com/gcm/send"))i=e.produceGCMProprietaryCURLCommand(e._currentSubscription,n);else{if(t&&t.trim().length>0)return r.style.display="none",void(e._stateMsg.textContent="Note: Push messages with a payload can't be sent with a cURL command due to the body of the web push protocol request being a stream.");e._stateMsg.textContent="",i=e.produceWebPushProtocolCURLCommand(e._currentSubscription,n)}r.style.display="block";var o=document.querySelector(".js-curl-code");o.innerHTML=i})}},{key:"updateXHRButton",value:function(){var e=document.querySelector(".js-xhr-button-container");return 0===this._currentSubscription.endpoint.indexOf("https://android.googleapis.com/gcm/send")&&this._payloadTextField.value.trim().length>0?void(e.style.display="none"):void(e.style.display="block")}},{key:"updateOrMessage",value:function(){var e=document.querySelector(".js-push-options-or"),t=document.querySelector(".js-xhr-button-container"),n=document.querySelector(".js-curl-container"),r="none"===t.style.display||"none"===n.style.display?"none":"block";e.style.display=r}},{key:"sendPushMessage",value:function(e,t){var n=this,r=Promise.resolve(null);t&&t.trim().length>0&&(r=y.generateHelper().then(function(n){return console.log(JSON.stringify(e)),n.encryptMessage(JSON.parse(JSON.stringify(e)),t)})),r.then(function(t){0===e.endpoint.indexOf("https://android.googleapis.com/gcm/send")?n.useGCMProtocol(e,t):n.useWebPushProtocol(e,t)})}},{key:"toBase64",value:function(e,t,n){t=t||0,n=n||e.byteLength;var r=new Uint8Array(e.slice(t,n));return btoa(String.fromCharCode.apply(null,r))}},{key:"useGCMProtocol",value:function(e,t){var n=this;console.log("Sending XHR to GCM Protocol endpoint");var r=new Headers;r.append("Content-Type","application/json"),r.append("Authorization","key="+this._API_KEY);var i=e.endpoint.split("/"),o=i[i.length-1],s={registration_ids:[o]};t&&(s.raw_data=this.toBase64(t.cipherText),r.append("Encryption","salt="+t.salt),r.append("Crypto-Key","dh="+t.publicServerKey),r.append("Content-Encoding","aesgcm")),fetch("https://android.googleapis.com/gcm/send",{method:"post",headers:r,body:JSON.stringify(s)}).then(function(e){return"opaque"!==e.type?e.json().then(function(e){if(0!==e.failure)throw console.log("Failed GCM response: ",e),new Error("Failed to send push message via GCM")}):void 0})["catch"](function(e){n.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"useWebPushProtocol",value:function(e,t){var n=this;console.log("Sending XHR to Web Push Protocol endpoint");var r=new Headers;r.append("TTL",60);var i={method:"post",headers:r};t&&(i.body=t.cipherText,r.append("Encryption","salt="+t.salt),r.append("Crypto-Key","dh="+t.publicServerKey),r.append("Content-Encoding","application/octet-stream"),r.append("Content-Encoding","aesgcm")),fetch(e.endpoint,i).then(function(e){if(e.status>=400&&e.status<500)throw console.log("Failed web push response: ",e,e.status),new Error("Failed to send push message via web push protocol")})["catch"](function(e){n.showErrorMessage("Ooops Unable to Send a Push",e)})}},{key:"produceGCMProprietaryCURLCommand",value:function(e,t){var n="",r="";t?(r=', \\"raw_data\\": \\"'+this.toBase64(t.cipherText)+'\\"',n+=' --header "Encryption: salt='+t.salt+'"',n+=' --header "Crypto-Key: dh='+t.publicServerKey+'"',n+=' --header "Content-Encoding: aesgcm"',this._stateMsg.textContent="Note: Push messages with a payload can't be sent to GCM due to a CORs issue. Trigger a push message with the cURL command below."):this._stateMsg.textContent="";var i="https://android.googleapis.com/gcm/send",o=e.endpoint.split("/"),s=o[o.length-1],a='curl --header "Authorization: key='+this._API_KEY+'" --header "Content-Type: application/json"'+n+" "+i+' -d "{\\"to\\":\\"'+s+'\\"'+r+'}"';return a}},{key:"produceWebPushProtocolCURLCommand",value:function(e){var t=e.endpoint,n='curl --header "TTL: 60" --request POST '+t;return n}},{key:"showErrorMessage",value:function(e,t){var n=document.querySelector(".js-error-message-container"),r=n.querySelector(".js-error-title"),i=n.querySelector(".js-error-message");r.textContent=e,i.innerHTML=t,n.style.opacity=1;var o=document.querySelector(".js-send-push-options");o.style.display="none"}}]),e}();t.exports=d},{}]},{},[1]);
//# sourceMappingURL=app-controller.js.map
