!function(e){var t={};function a(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=t,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)a.d(s,i,function(t){return e[t]}.bind(null,i));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=1)}([function(e,t,a){},function(e,t,a){"use strict";a.r(t);a(0);function s(e,t){if(e>0&&e<t-1)return"top";const a=t*t,s=a-t;return 0===e?"top-left":e===t-1?"top-right":e===a-1?"bottom-right":e===s?"bottom-left":e>s&&e<a?"bottom":e%t==0?"left":e%t==t-1?"right":"center"}class i{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML='\n      <div class="controls">\n        <button data-id="action-restart" class="btn">New Game</button>\n        <button data-id="action-save" class="btn">Save Game</button>\n        <button data-id="action-load" class="btn">Load Game</button>\n      </div>\n      <div class="board-container">\n        <div data-id="board" class="board"></div>\n      </div>\n    ',this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",e=>this.onNewGameClick(e)),this.saveGameEl.addEventListener("click",e=>this.onSaveGameClick(e)),this.loadGameEl.addEventListener("click",e=>this.onLoadGameClick(e)),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const t=document.createElement("div");t.classList.add("cell","map-tile","map-tile-"+s(e,this.boardSize)),t.addEventListener("mouseenter",e=>this.onCellEnter(e)),t.addEventListener("mouseleave",e=>this.onCellLeave(e)),t.addEventListener("click",e=>this.onCellClick(e)),this.boardEl.appendChild(t)}this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const n=document.createElement("div");n.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),n.style.width=a.character.health+"%",i.appendChild(n),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach(e=>e.call(null,t))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach(e=>e.call(null,t))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach(e=>e.call(null,t))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach(e=>e.call(null))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach(e=>e.call(null))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach(e=>e.call(null))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e,t="yellow"){this.deselectCell(e),this.cells[e].classList.add("selected","selected-"+t)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter(e=>e.startsWith("selected")))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise(a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",()=>{s.removeChild(i),a()})})}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}var n={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"};class r{static from(e){return this.state=e,null}}class l{constructor(){this.players=[]}addPlayers(e){this.players=[...this.players,...e]}remove(e){const t=this.players.findIndex(t=>t.position===e);this.players.splice(t,1)}}function c(e,t){return e=Math.ceil(e),(t=Math.floor(t))===e?e:Math.floor(Math.random()*(t-e))+e}function*o(e,t){const a=c(1,t),s=e[c(0,e.length)];yield new s(a)}function h(e,t,a){const s=[];for(let i=0;i<a;i++){const a=o(e,t);s.push(a.next().value)}return s}class d{constructor(e,t="generic"){if(this.level=e,this.attack=0,this.defence=0,this.health=50,this.type=t,"Character"===new.target.name)throw new Error("Error while creating new instance of Character. Disallowed")}}class m{constructor(e,t){if(!(e instanceof d))throw new Error("character must be instance of Character or its children");if("number"!=typeof t)throw new Error("position must be a number");this.character=e,this.position=t}}var p={swordsman:"swordsman",bowman:"bowman",magician:"magician",daemon:"daemon",undead:"undead",vampire:"vampire"};var u={[p.bowman]:{attack:25,defence:25,stepDistance:2,attackDistance:2},[p.swordsman]:{attack:40,defence:10,stepDistance:4,attackDistance:1},[p.magician]:{attack:10,defence:40,stepDistance:1,attackDistance:4},[p.vampire]:{attack:25,defence:25,stepDistance:2,attackDistance:2},[p.undead]:{attack:40,defence:10,stepDistance:4,attackDistance:1},[p.daemon]:{attack:10,defence:40,stepDistance:1,attackDistance:4}};class f extends d{constructor(e){super(e),this.type=p.bowman;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.bowman];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}class y extends d{constructor(e){super(e),this.type=p.swordsman;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.swordsman];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}class g extends d{constructor(e){super(e),this.type=p.magician;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.magician];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}class b extends d{constructor(e){super(e),this.type=p.undead;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.undead];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}class C extends d{constructor(e){super(e),this.type=p.daemon;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.daemon];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}class v extends d{constructor(e){super(e),this.type=p.vampire;const{attack:t,defence:a,stepDistance:s,attackDistance:i}=u[p.vampire];this.attack=t,this.defence=a,this.stepDistance=s,this.attackDistance=i}}const w=[f,y,g],k=[b,C,v];function P(e){return new Array(e*e).fill(null).map((e,t)=>t)}function S(e,t,a,s,i=[]){return[...i,...h(e,a,s)].map(e=>{const a=c(0,t.length),s=t[a];return t.splice(a,1),new m(e,s)})}function L(e,t,a=[]){const s=function(e){return P(e).filter(t=>t<2*e)}(t),i=function(e){return P(e).filter(t=>t>e**2-2*e)}(t);let n,r;switch(e){case 0:n=S([f,y],s,e+1,2),r=S(k,i,e+1,2);break;case 1:n=S(w,s,e+1,1,a),r=S(k,i,e+1,n.length);break;case 2:case 3:n=S(w,s,e+1,2,a),r=S(k,i,e+1,n.length)}return{gamerTeam:n,pcTeam:r}}var D={auto:"auto",pointer:"pointer",crosshair:"crosshair",notallowed:"not-allowed"};function E(e,t){const a=e%t,s=t-a-1,i=Math.trunc(e/t);return{leftCorner:a,rightCorner:s,topCorner:i,bottomCorner:t-i-1}}function M(e,t,a,s){const{leftCorner:i,rightCorner:n,topCorner:l,bottomCorner:c}=E(e,a),o=Math.min(t,i),h=Math.min(t,n);let d=Math.min(t,l),m=Math.min(t,c);const p=[],u=e+h,f=[];for(let t=e-o;t<=u;t++)f.push(t);for(p.push(...f);d>0;)f.forEach(e=>{p.push(e-a*d)}),d--;for(;m>0;)f.forEach(e=>{p.push(e+a*m)}),m--;const y=r.state.team.players.filter(e=>s.some(t=>e.character instanceof t)).map(e=>e.position);return p.sort((e,t)=>Math.sign(e-t)).filter(e=>y.includes(e))}function G(e,t,a,s){const{leftCorner:i,rightCorner:n,topCorner:r,bottomCorner:l}=E(e,a),c=Math.min(t,i),o=Math.min(t,n),h=Math.min(t,r),d=Math.min(t,l),m=Math.min(c,h),p=Math.min(o,h),u=Math.min(c,d),f=Math.min(o,d),y=[];for(let t=e-c;t<e;t++)y.push(t);for(let t=e+1;t<=e+o;t++)y.push(t);let g=h;for(;g>0;)y.push(e-a*g),g-=1;let b=d;for(;b>0;)y.push(e+a*b),b-=1;let C=m;for(;C>0;)y.push(e-C-a*C),C--;let v=p;for(;v>0;)y.push(e+v-a*v),v--;let w=u;for(;w>0;)y.push(e-w+a*w),w--;let k=f;for(;k>0;)y.push(e+k+a*k),k--;return y.sort((e,t)=>Math.sign(e-t)).filter(e=>!s.includes(e))}class x{constructor(e,t){this.players=e,this.boardSize=t,this.pcPlayers=e.filter(e=>k.some(t=>e.character instanceof t)),this.gamerPlayers=e.filter(e=>w.some(t=>e.character instanceof t)),this.result={},this.init()}init(){const e=this.findCanAttack();return e.listOfAttacked.length>0?this.result={start:e.player.position,end:e.listOfAttacked[0],type:"attack"}:this.findBestWay(this.findClosestPlayer()),this}findCanAttack(){let e,t=this.pcPlayers.length-1,a=[];for(;t>=0;)e=this.pcPlayers[t],a=M(e.position,e.character.attackDistance,this.boardSize,w),a.length>0&&(t=0),t--;return{listOfAttacked:a,player:e}}findClosestPlayer(){let e={},t=1/0;return this.pcPlayers.forEach(a=>{this.gamerPlayers.forEach(s=>{const i=Math.trunc(a.position/this.boardSize),n=Math.trunc(s.position/this.boardSize),r=Math.abs(i-n),l=a.position%this.boardSize,c=s.position%this.boardSize,o=r*Math.abs(l-c);o<t&&(e={pcPlayer:a,gamerPlayer:s},t=o)})}),e}findBestWay(e){const t=Math.trunc(e.gamerPlayer.position/this.boardSize),a=e.gamerPlayer.position%this.boardSize,s=r.state.team.players.map(e=>e.position),i=G(e.pcPlayer.position,e.pcPlayer.character.stepDistance,this.boardSize,s).map(e=>{const s=Math.trunc(e/this.boardSize),i=e%this.boardSize;return{index:e,empiricPath:Math.abs(s-t)+Math.abs(i-a)}}),n=i.map(e=>e.empiricPath),l=Math.min(...n),c=i.find(e=>e.empiricPath===l).index;this.result={start:e.pcPlayer.position,end:c,type:"step"}}}var T={pc:"pc",gamer:"gamer"};var O={[p.swordsman]:y,[p.bowman]:f,[p.magician]:g,[p.daemon]:C,[p.undead]:b,[p.vampire]:v};function z(e){return new Promise(t=>{setTimeout(()=>{t(!0)},e)})}const A=new i;A.bindToDOM(document.querySelector("#game-container"));const N=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage);new class{constructor(e,t){this.gamePlay=e,this.stateService=t}init(){this.gamePlay.drawUi(Object.values(n)[0]),this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this)),this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this)),this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this)),this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this)),r.state||this.loadState(),this.gamePlay.redrawPositions(r.state.team.players)}onNewGameClick(){r.state.disabled||r.state.player===T.pc||(this.createNewGame(),this.gamePlay.redrawPositions(r.state.team.players),i.showMessage("New game started"))}onCellClick(e){if(r.state.disabled||r.state.player===T.pc)return;const t=r.state.team.players.find(t=>t.position===e);if(null!==r.state.selected){if(t){const a=w.some(e=>t.character instanceof e),s=k.some(e=>t.character instanceof e);e===t.position&&e===r.state.selected?(this.gamePlay.deselectCell(e),r.state.selected=null):a?(this.gamePlay.deselectCell(r.state.selected),r.state.selected=null,this.trySelectUser(e,t)):s&&r.state.canAttack.includes(e)&&this.attack(r.state.selected,e).then(()=>{this.gamePlay.deselectCell(r.state.selected),r.state.selected=null,this.gamePlay.deselectCell(e),this.gamePlay.setCursor(D.auto),this.gamePlay.redrawPositions(r.state.team.players),r.state.disabled=!0,this.checkStepResults()})}else if(r.state.canStep.includes(e)){const t=r.state.selected;this.gamePlay.deselectCell(t);r.state.team.players.find(e=>e.position===t).position=e,r.state.selected=null,this.gamePlay.redrawPositions(r.state.team.players),this.gamePlay.deselectCell(e),this.playByPc()}}else this.trySelectUser(e,t)}onCellEnter(e){if(r.state.disabled||r.state.player===T.pc)return;const t=r.state.team.players.find(t=>t.position===e);this.showTooltip(t,r.state.selected),this.setCursor(e,t),this.highlightCell(e)}onCellLeave(e){r.state.disabled||(this.gamePlay.hideCellTooltip(e),this.gamePlay.setCursor(D.auto),null!==r.state.selected&&r.state.selected!==e&&this.gamePlay.deselectCell(e))}onSaveGameClick(){r.state.disabled||r.state.player===T.pc||(this.stateService.save(r.state),i.showMessage("Game saved"))}onLoadGame(){r.state.disabled||r.state.player===T.pc||(this.loadState(),this.gamePlay.redrawPositions(r.state.team.players),i.showMessage("Game loaded"))}createNewGame(){const{gamerTeam:e,pcTeam:t}=L(0,this.gamePlay.boardSize),a=new l;a.addPlayers([...t,...e]),r.state={team:a,level:0,player:T.gamer,selected:null,canStep:[],canAttack:[],disabled:!1,currentScores:0,maxScores:r.state?r.state.maxScores:0},this.stateService.save(r.state)}showTooltip(e,t){if(e&&!t){const{level:t,attack:a,defence:s,health:i}=e.character;this.gamePlay.showCellTooltip(`🎖${t} ⚔${a} 🛡${s} ❤${i}`,e.position)}}setCursor(e,t){if(null!==r.state.selected)if(r.state.canStep.includes(e))this.gamePlay.setCursor(D.pointer);else{const a=w.some(e=>t&&t.character instanceof e),s=k.some(e=>t&&t.character instanceof e);a?this.gamePlay.setCursor(D.pointer):s&&(r.state.canAttack.includes(e)?this.gamePlay.setCursor(D.crosshair):this.gamePlay.setCursor(D.notallowed))}else t&&this.gamePlay.setCursor(D.pointer)}highlightCell(e){null!==r.state.selected&&(r.state.canStep.includes(e)&&this.gamePlay.selectCell(e,"green"),r.state.canAttack.includes(e)&&this.gamePlay.selectCell(e,"red"))}trySelectUser(e,t){const a=w.some(e=>t&&t.character instanceof e),s=k.some(e=>t&&t.character instanceof e);if(a){r.state.selected=e,this.gamePlay.selectCell(e);const a=r.state.team.players.map(e=>e.position);r.state.canStep=G(e,t.character.stepDistance,this.gamePlay.boardSize,a),r.state.canAttack=M(e,t.character.attackDistance,this.gamePlay.boardSize,k)}else s&&i.showError("You can not use this person")}async attack(e,t){if(r.state.selected&&r.state.disabled)return;r.state.disabled=!0;const a=r.state.team.players.find(t=>t.position===e).character,s=r.state.team.players.find(e=>e.position===t).character,i=Math.max(a.attack-s.defence,.1*a.attack);await this.gamePlay.showDamage(t,i);let n=s.health-i;n=n>0?n:0,s.health=n,0===s.health&&r.state.team.remove(t)}checkStepResults(){r.state.disabled=!0;let e=r.state.team.players.map(e=>e.character).filter(e=>w.some(t=>e instanceof t));const t=r.state.team.players.map(e=>e.character).filter(e=>k.some(t=>e instanceof t));if(0===e.length)i.showMessage(`You loose! Current scores: ${r.state.currentScores}, max scores: ${r.state.maxScores}`),r.state.selected=null,r.state.disabled=!1,r.state.player=T.gamer,this.stateService.save(r.state);else if(0===t.length)if(r.state.level===Object.keys(n).length-1)i.showMessage(`You win! Current scores: ${r.state.currentScores}, max scores: ${r.state.maxScores}`),r.state.maxScores=r.state.maxScores>r.state.currentScores?r.state.maxScores:r.state.currentScores,r.state.selected=null,r.state.disabled=!1,r.state.player=T.gamer,this.stateService.save(r.state);else{const t=e.reduce((e,t)=>e+t.health,r.state.currentScores);e=e.map(e=>{e.level+=1;const t=e.health+80;e.health=t>100?100:t;const a=Math.max(e.attack,e.attack*(80+e.health)/100),s=Math.max(e.defence,e.defence*(80+e.health)/100);return e.attack=a,e.defence=s,e});const a=r.state.level+1,{gamerTeam:s,pcTeam:i}=L(a,this.gamePlay.boardSize,e),c=new l;c.addPlayers([...i,...s]),r.state={team:c,level:a,selected:null,player:T.gamer,canStep:[],canAttack:[],disabled:!1,currentScores:t,maxScores:r.state.maxScores},this.gamePlay.drawUi(Object.values(n)[a]),this.gamePlay.redrawPositions(r.state.team.players)}else this.playByPc()}async playByPc(){r.state.player=T.pc,r.state.disabled=!0,this.pcController=new x(r.state.team.players,this.gamePlay.boardSize);const{result:e}=this.pcController;await z(500),this.gamePlay.selectCell(e.start),await z(500);const t="step"===e.type?"green":"red";if(this.gamePlay.selectCell(e.end,t),await z(500),"step"===e.type){const t=r.state.team.players.find(t=>t.position===e.start);t&&(t.position=e.end,this.gamePlay.redrawPositions(r.state.team.players),this.gamePlay.deselectCell(e.start),this.gamePlay.deselectCell(e.end))}else await this.attack(e.start,e.end),this.gamePlay.redrawPositions(r.state.team.players),this.gamePlay.deselectCell(e.start),this.gamePlay.deselectCell(e.end);await z(50);0===r.state.team.players.map(e=>e.character).filter(e=>w.some(t=>e instanceof t)).length?(i.showMessage(`You loose! Current scores: ${r.state.currentScores}, max scores: ${r.state.maxScores}`),r.state.selected=null,r.state.disabled=!1,r.state.player=T.gamer,this.stateService.save(r.state)):(r.state.disabled=!1,r.state.player=T.gamer)}loadState(){const e=this.stateService.load();if(e){const t=new l,a=e.team.players.map(e=>{const{level:t,type:a,attack:s,attackDistance:i,defence:n,health:r,stepDistance:l}=e.character,c=new(0,O[a])(t);return c.attack=s,c.attackDistance=i,c.defence=n,c.health=r,c.stepDistance=l,{character:c,position:e.position}});t.addPlayers(a),e.team=t,e.canStep=[],e.canAttack=[],e.selected=null,r.from(e)}r.state||this.createNewGame();const t=r.state.team.players.filter(e=>w.some(t=>e instanceof t)),a=r.state.team.players.filter(e=>k.some(t=>e instanceof t));r.state.level!==Object.keys(n).length-1||0!==t.length&&0!==a.length||this.createNewGame(),r.state.player===T.pc&&this.playByPc()}}(A,N).init()}]);