(()=>{"use strict";var t={292:(t,e,i)=>{i.r(e)},265:(t,e,i)=>{var s;Object.defineProperty(e,"__esModule",{value:!0}),e.DomService=void 0;const a=i(451);class r{static getElement(t){const e=document.querySelector(t);if(null===e)throw new Error(`Element ${t} is missing from DOM`);return e}static getAllElements(t){const e=document.querySelectorAll(t);if(null===e)throw new Error(`Element ${t} is missing from DOM`);return e}}e.DomService=r,s=r,r.boardContainer=s.getElement(a.Settings.SELECTOR_BOARD_CONTAINER),r.resetButton=s.getElement(a.Settings.SELECTOR_RESET_BUTTON),r.sizeInput=s.getElement(a.Settings.SELECTOR_SIZE_INPUT),r.decreaseButton=s.getElement(a.Settings.SELECTOR_DECREASE_BUTTON),r.increaseButton=s.getElement(a.Settings.SELECTOR_INCREASE_BUTTON),r.getAllCells=()=>s.getAllElements(a.Settings.SELECTOR_CELL),r.modal=s.getElement(a.Settings.SELECTOR_MODAL),r.modalCloseButton=s.getElement(a.Settings.SELECTOR_MODAL_CLOSE_BUTTON),r.modalButton=s.getElement(a.Settings.SELECTOR_MODAL_BUTTON),r.modalMessage=s.getElement(a.Settings.SELECTOR_MODAL_MESSAGE),r.statistics=s.getElement(a.Settings.SELECTOR_STATISTICS),r.clearStatisticsBtn=s.getElement(a.Settings.SELECTOR_CLEAR_STATISTICS_BTN)},733:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.CellStatus=void 0,function(t){t.X="X",t.O="O",t.EMPTY=""}(i||(e.CellStatus=i={}))},468:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Game=void 0;const s=i(451),a=i(265),r=i(733),o=i(369);e.Game=class{constructor(t=new o.Modal){this.modal=t,this.board=[],this.currentPlayer=r.CellStatus.EMPTY,this.boardElement=a.DomService.boardContainer,this.resetButtonElement=a.DomService.resetButton,this.sizeInputElement=a.DomService.sizeInput,this.decreaseButtonElement=a.DomService.decreaseButton,this.increaseButtonElement=a.DomService.increaseButton,this.clearStatisticsBtnElement=a.DomService.clearStatisticsBtn,this.cellClickHandler=t=>{t.preventDefault();const e=t.target,i=+e.dataset.x,s=+e.dataset.y;this.makeMove(i,s,e)},this.boardSize=this.getSizeFromLocalStorage(),this.initInputField(),this.initResetButton(),this.initClearStatisticsButton(),this.updateStatisticsDisplay(this.getGameStatistics()),this.reset()}initInputField(){this.sizeInputElement&&(this.sizeInputElement.value=this.boardSize.toString(),this.decreaseButtonElement.addEventListener("click",(()=>{this.boardSize>s.Settings.MIN_BOARD_SIZE&&(this.boardSize--,this.sizeInputElement.value=this.boardSize.toString(),this.updateSize(this.sizeInputElement.value)),this.toggleButtonStates()})),this.increaseButtonElement.addEventListener("click",(()=>{this.boardSize<s.Settings.MAX_BOARD_SIZE&&(this.boardSize++,this.sizeInputElement.value=this.boardSize.toString(),this.updateSize(this.sizeInputElement.value)),this.toggleButtonStates()})),this.toggleButtonStates())}initResetButton(){this.resetButtonElement.addEventListener("click",(()=>this.reset()))}reset(){if(this.currentPlayer=r.CellStatus.X,this.board=Array.from({length:this.boardSize},(()=>Array.from({length:this.boardSize},(()=>r.CellStatus.EMPTY)))),this.boardElement){const t=a.DomService.getAllCells();for(const e of t)e.textContent=""}this.boardElement.removeEventListener("mousedown",this.cellClickHandler),this.boardElement.addEventListener("mousedown",this.cellClickHandler),this.fillBoardTemplate()}fillBoardTemplate(){if(this.boardElement){this.boardElement.innerHTML="",this.boardElement.style.gridTemplateRows=`repeat(${this.boardSize}, 1fr)`,this.boardElement.style.gridTemplateColumns=`repeat(${this.boardSize}, 1fr)`,this.boardElement.style.setProperty("--grid-size",this.boardSize.toString());const t=document.createDocumentFragment();for(let e=0;e<this.boardSize;e++)for(let i=0;i<this.boardSize;i++)t.append(this.createCellTemplate(e,i));this.boardElement.append(t)}}createCellTemplate(t,e){const i=document.createElement("div");return i.classList.add("cell"),t<this.boardSize-1&&i.classList.add("cell_border-bottom"),e<this.boardSize-1&&i.classList.add("cell_border-right"),i.dataset.x=t.toString(),i.dataset.y=e.toString(),i}toggleButtonStates(){this.decreaseButtonElement.disabled=this.boardSize<=s.Settings.MIN_BOARD_SIZE,this.increaseButtonElement.disabled=this.boardSize>=s.Settings.MAX_BOARD_SIZE}updateSize(t){const e=Number.parseInt(t,10);!Number.isNaN(e)&&e>=s.Settings.MIN_BOARD_SIZE&&e<=s.Settings.MAX_BOARD_SIZE&&(this.boardSize=e,localStorage.setItem("boardSize",this.boardSize.toString()),this.reset())}makeMove(t,e,i){return t<0||t>=this.boardSize||e<0||e>=this.boardSize?(console.error("{Ход выходит за пределы доски}"),!1):this.board[t][e]!==r.CellStatus.EMPTY?(this.modal.showModal("Эта ячейка уже занята"),!1):(i.textContent=this.currentPlayer,i.classList.add(this.currentPlayer),this.board[t][e]=this.currentPlayer,this.checkWinner()?(this.boardElement.removeEventListener("mousedown",this.cellClickHandler),this.saveGameResult(this.currentPlayer),this.modal.showModal(`Игрок ${this.currentPlayer} победил!`,!0,this.reset.bind(this)),!0):this.checkDraw()?(this.boardElement.removeEventListener("mousedown",this.cellClickHandler),this.saveGameResult("draw"),this.modal.showModal("Ничья",!0,this.reset.bind(this)),!0):(this.togglePlayer(),!1))}checkWinner(){const t=this.checkHorizontal()||this.checkVertical()||this.checkMainDiagonal()||this.checkSecondDiagonal();return!!t&&(this.highlightWinningCells(t),!0)}checkDraw(){return this.board.flat().every((t=>t!==r.CellStatus.EMPTY))}checkLine(t){return t.every((e=>e!==r.CellStatus.EMPTY&&e===t[0]))}checkHorizontal(){for(let t=0;t<this.boardSize;t++)if(this.checkLine(this.board[t]))return this.board[t].map(((e,i)=>[t,i]));return null}checkVertical(){for(let t=0;t<this.boardSize;t++){const e=this.board.map((e=>e[t]));if(this.checkLine(e))return e.map(((e,i)=>[i,t]))}return null}checkMainDiagonal(){const t=[];for(let e=0;e<this.boardSize;e++)t.push(this.board[e][e]);return this.checkLine(t)?t.map(((t,e)=>[e,e])):null}checkSecondDiagonal(){const t=[];for(let e=0;e<this.boardSize;e++)t.push(this.board[e][this.boardSize-e-1]);return this.checkLine(t)?t.map(((t,e)=>[e,this.boardSize-e-1])):null}togglePlayer(){this.currentPlayer=this.currentPlayer===r.CellStatus.X?r.CellStatus.O:r.CellStatus.X}getSizeFromLocalStorage(){const t=localStorage.getItem("boardSize");return t?Number.parseInt(t,10):s.Settings.MIN_BOARD_SIZE}saveGameResult(t){const e="gameStatistics";let i=[];try{i=JSON.parse(localStorage.getItem(e)||"[]")}catch(t){console.error("Ошибка при парсинге JSON из localStorage:",t),i=[]}i.length>=10&&i.shift(),Array.isArray(i)&&i.push(t),localStorage.setItem(e,JSON.stringify(i)),this.updateStatisticsDisplay(i)}getGameStatistics(){try{return JSON.parse(localStorage.getItem("gameStatistics")||"[]")}catch(t){return console.error("Ошибка при парсинге JSON из localStorage:",t),[]}}updateStatisticsDisplay(t){const e=a.DomService.statistics;e&&Array.isArray(t)&&(e.innerHTML=t.map(((t,e)=>`${e+1}. ${"draw"===t?"Ничья":`Игрок ${t} победил`}`)).join("<br>"))}initClearStatisticsButton(){this.clearStatisticsBtnElement.addEventListener("click",(()=>this.clearStatistics()))}clearStatistics(){localStorage.removeItem("gameStatistics"),this.updateStatisticsDisplay([])}highlightWinningCells(t){const e=`win-cell-${this.currentPlayer}`;t.forEach((([t,i])=>{const s=document.querySelector(`.cell[data-x="${t}"][data-y="${i}"]`);s&&s.classList.add(e)}))}}},369:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Modal=void 0;const s=i(265);e.Modal=class{constructor(){this.modal=s.DomService.modal,this.modalCloseButton=s.DomService.modalCloseButton,this.modalButton=s.DomService.modalButton,this.modalMessage=s.DomService.modalMessage,this.hideModal=()=>{this.modal.style.display="none"},this.initModal()}initModal(){this.modalCloseButton.addEventListener("click",this.hideModal),window.addEventListener("click",(t=>{t.target===this.modal&&this.hideModal()})),window.addEventListener("keydown",(t=>{"Escape"===t.key&&this.hideModal()}))}showModal(t,e,i){this.resetState(),this.modalMessage.textContent=t,this.modal.style.display="block",this.modalButton.addEventListener("click",this.hideModal),e&&i&&(this.modalButton.textContent="Новая игра",this.modalButton.addEventListener("click",i))}resetState(){this.modalButton.textContent="OK";const t=this.modalButton.cloneNode(!0);this.modalButton.replaceWith(t),this.modalButton=t}}},451:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Settings=void 0;class i{}e.Settings=i,i.SELECTOR_BOARD_CONTAINER=".board-container",i.SELECTOR_CELL=".cell",i.SELECTOR_RESET_BUTTON=".reset-button",i.SELECTOR_SIZE_INPUT=".size-input",i.SELECTOR_DECREASE_BUTTON=".decrease",i.SELECTOR_INCREASE_BUTTON=".increase",i.SELECTOR_MODAL=".modal",i.SELECTOR_MODAL_CLOSE_BUTTON=".modal-close",i.SELECTOR_MODAL_BUTTON=".modal-button",i.SELECTOR_MODAL_MESSAGE=".modal-message",i.SELECTOR_STATISTICS=".statistics",i.SELECTOR_CLEAR_STATISTICS_BTN=".clear-statistics-button",i.MIN_BOARD_SIZE=3,i.MAX_BOARD_SIZE=9}},e={};function i(s){var a=e[s];if(void 0!==a)return a.exports;var r=e[s]={exports:{}};return t[s](r,r.exports,i),r.exports}i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{const t=i(468);i(292),document.addEventListener("DOMContentLoaded",(()=>{new t.Game}))})()})();
//# sourceMappingURL=bundle.js.map