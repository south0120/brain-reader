// Brain学習アシスト - content.js
// brain-market.com の全ページで自動起動

(function() {
    'use strict';
  
    // 既に起動済みなら重複防止
    if (document.getElementById('brain-reader-style')) return;
  
    // ===== スタイル注入 =====
    const style = document.createElement('style');
    style.id = 'brain-reader-style';
    const BR_FONT = `"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic Medium","Yu Gothic",YuGothic,Meiryo,-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif`;
    style.textContent = `
      #brain-reader-panel,#brain-reader-toggle,#br-highlight-popup,#br-note-modal,#br-resume,#br-toast,#br-tutorial{font-family:${BR_FONT}}
      #brain-reader-panel,#brain-reader-panel *,#br-highlight-popup,#br-highlight-popup *,#br-note-modal,#br-note-modal *,#br-resume,#br-resume *,#br-tutorial,#br-tutorial *{counter-reset:none!important;counter-increment:none!important}
      #brain-reader-panel h1::before,#brain-reader-panel h2::before,#brain-reader-panel h3::before,#brain-reader-panel h4::before,#brain-reader-panel h5::before,#brain-reader-panel h6::before,#brain-reader-panel h1::after,#brain-reader-panel h2::after,#brain-reader-panel h3::after,#brain-reader-panel h4::after,#brain-reader-panel h5::after,#brain-reader-panel h6::after,#brain-reader-panel p::before,#brain-reader-panel p::after,#brain-reader-panel div::before,#brain-reader-panel div::after,#br-resume *::before,#br-resume *::after,#br-tutorial *::before,#br-tutorial *::after{content:none!important;counter-increment:none!important}
      #brain-reader-panel{position:fixed;top:0;right:0;width:320px;height:100vh;background:#ffffff;color:#1f2937;z-index:999999;display:flex;flex-direction:column;box-shadow:-4px 0 24px rgba(15,23,42,.12);font-size:13px;transform:translateX(100%);transition:transform .3s ease;border-left:1px solid #e5e7eb}
      #brain-reader-panel.open{transform:translateX(0)}
      #brain-reader-toggle{position:fixed;top:50%;right:0;transform:translateY(-50%);background:linear-gradient(135deg,#ff6b35,#ef4444);color:white;border:none;padding:12px 10px;cursor:pointer;z-index:1000000;border-radius:10px 0 0 10px;box-shadow:-2px 0 10px rgba(239,68,68,.3);display:flex;align-items:center;justify-content:center}
      #brain-reader-toggle{transition:transform .3s ease,opacity .3s ease}
      #brain-reader-toggle:hover{filter:brightness(1.05)}
      #brain-reader-toggle.br-hidden{transform:translateY(-50%) translateX(120%);opacity:0;pointer-events:none}
      #brain-reader-toggle.br-disabled{opacity:.4;cursor:not-allowed;filter:grayscale(.3)}
      #brain-reader-toggle.br-disabled:hover{filter:grayscale(.3)}
      #brain-reader-header{padding:14px 16px;background:#ffffff;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f1f1f1}
      #brain-reader-header .br-title{margin:0;font-size:13px;color:#ef4444;font-weight:700;letter-spacing:.5px;display:flex;align-items:center;gap:7px}
      #brain-reader-header .br-title svg{stroke:#ef4444}
      #brain-reader-header .br-title::before,#brain-reader-header .br-title::after{content:none!important;display:none!important}
      #brain-reader-header .br-h-actions{display:flex;gap:4px;align-items:center}
      #brain-reader-header .br-h-actions button{background:none;border:none;cursor:pointer;color:#9ca3af;padding:5px;border-radius:6px;display:flex;align-items:center;justify-content:center}
      #brain-reader-header .br-h-actions button:hover{color:#ef4444;background:#fff5f3}
      #brain-reader-tabs{display:flex;background:#fafafa;border-bottom:1px solid #f1f1f1}
      .br-tab{flex:1;padding:12px 4px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#9ca3af;border:none;background:none;border-bottom:2px solid transparent;transition:all .2s;font-family:inherit}
      .br-tab svg{stroke-width:1.8}
      .br-tab:hover{color:#ef4444;background:rgba(239,68,68,.04)}
      .br-tab.active{color:#ef4444;border-bottom-color:#ef4444;background:white}
      #brain-reader-content{flex:1;overflow-y:auto;padding:12px;background:#ffffff}
      #brain-reader-content::-webkit-scrollbar{width:6px}
      #brain-reader-content::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:3px}
      #brain-reader-content::-webkit-scrollbar-thumb:hover{background:#d1d5db}
      .br-section{display:none}
      .br-section.active{display:block}
      #brain-progress-bar{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#ff6b35,#ef4444);z-index:999998;transition:width .3s;pointer-events:none;box-shadow:0 1px 4px rgba(239,68,68,.3)}
      .br-heading-actions{display:inline-flex;gap:3px;margin-left:8px;opacity:0;transition:opacity .2s;vertical-align:middle}
      h2:hover .br-heading-actions,h3:hover .br-heading-actions,h4:hover .br-heading-actions,.br-heading-actions.br-show{opacity:1}
      .br-btn-bm{background:linear-gradient(135deg,#ff8a3d,#ff6b35);color:white;border:none;border-radius:6px;padding:4px 7px;cursor:pointer;box-shadow:0 1px 3px rgba(255,107,53,.3);font-family:inherit;display:inline-flex;align-items:center;justify-content:center}
      .br-btn-bm:hover{filter:brightness(1.05)}
      .br-btn-bm.active{background:linear-gradient(135deg,#ef4444,#dc2626)}
      .br-highlight{border-radius:2px;cursor:pointer;padding:1px 0}
      .br-highlight-yellow{background:rgba(252,211,77,.5)}
      .br-highlight-green{background:rgba(110,231,183,.5)}
      .br-highlight-red{background:rgba(252,165,165,.55)}
      .br-highlight-blue{background:rgba(147,197,253,.5)}
      #br-highlight-popup{position:absolute;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px;z-index:1000001;display:none;gap:8px;align-items:center;box-shadow:0 8px 24px rgba(15,23,42,.15)}
      #br-highlight-popup.show{display:flex}
      .br-color-btn{width:24px;height:24px;border-radius:50%;border:2px solid #fff;cursor:pointer;transition:transform .15s;box-shadow:0 0 0 1px #e5e7eb}
      .br-color-btn:hover{transform:scale(1.15);box-shadow:0 0 0 2px #ef4444}
      .br-color-btn.yellow{background:#fbbf24}.br-color-btn.green{background:#34d399}.br-color-btn.red{background:#f87171}.br-color-btn.blue{background:#60a5fa}
      #br-add-note-btn{background:linear-gradient(135deg,#ff6b35,#ef4444);color:white;border:none;border-radius:6px;padding:5px 8px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;justify-content:center}
      .br-toc-item{padding:6px 8px;cursor:pointer;border-radius:5px;color:#374151;line-height:1.4;display:flex;align-items:center;gap:6px;transition:all .15s}
      .br-toc-item:hover{background:#fff5f3;color:#ef4444}
      .br-toc-item.h2{font-size:12px;font-weight:600;color:#1f2937}
      .br-toc-item.h3{font-size:11px;padding-left:20px;color:#4b5563}
      .br-toc-item.h4{font-size:11px;padding-left:32px;color:#6b7280}
      .br-check{flex-shrink:0;width:13px;height:13px;display:inline-flex;align-items:center;justify-content:center;color:#d1d5db}
      .br-check svg{stroke:#10b981}
      .br-dot-mark{color:#d1d5db;font-weight:700}
      .br-toc-item.active{background:#fff5f3;color:#ef4444;font-weight:600}
      .br-toc-item.active .br-toc-txt{color:#ef4444}
      .br-bm-dot{width:7px;height:7px;background:#ff6b35;border-radius:50%;flex-shrink:0;box-shadow:0 0 0 2px rgba(255,107,53,.2)}
      .br-bookmark-item{padding:10px 12px;background:#fafafa;border-radius:8px;margin-bottom:7px;cursor:pointer;border-left:3px solid #ff6b35;transition:all .2s;border:1px solid #f1f1f1;border-left-width:3px}
      .br-bookmark-item:hover{background:#fff5f3;border-color:#fed7aa;border-left-color:#ef4444}
      .bm-title{font-size:12px;color:#1f2937;margin-bottom:4px;line-height:1.4;font-weight:500}
      .bm-meta{font-size:10px;color:#9ca3af;display:flex;justify-content:space-between;align-items:center}
      .bm-del{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;padding:2px 4px;border-radius:4px}
      .bm-del:hover{color:#ef4444;background:#fef2f2}
      .br-hl-item{padding:10px 12px;background:#fafafa;border-radius:8px;margin-bottom:7px;border-left:3px solid #fbbf24;border:1px solid #f1f1f1;border-left-width:3px;cursor:pointer;transition:background .2s}
      .br-hl-item:hover{background:#fff5f3}
      .br-hl-text{font-size:12px;color:#1f2937;margin-bottom:4px;line-height:1.5}
      .br-hl-note{font-size:11px;color:#ef4444;margin-top:5px;padding-top:5px;border-top:1px dashed #e5e7eb;font-weight:500}
      .br-hl-meta{font-size:10px;color:#9ca3af;display:flex;justify-content:space-between;align-items:center;margin-top:4px}
      .br-stat-card{background:#fafafa;border:1px solid #f1f1f1;border-radius:8px;padding:12px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
      .br-stat-val{font-size:22px;font-weight:700;color:#ef4444;line-height:1}
      .br-stat-lbl{font-size:11px;color:#6b7280;font-weight:500}
      .br-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:10px}
      .br-stat-grid .br-stat-card{margin:0;padding:10px 12px;flex-direction:column;align-items:flex-start;gap:4px}
      .br-stat-grid .br-stat-val{font-size:20px}
      .br-progress-box{background:#fff5f3;border:1px solid #fed7aa;border-radius:10px;padding:12px 14px;margin-bottom:10px}
      .br-progress-lbl{font-size:11px;color:#9ca3af;font-weight:600;letter-spacing:.5px;margin-bottom:7px}
      .br-progress-track{background:#ffe4d6;border-radius:6px;height:8px;overflow:hidden;margin-bottom:6px}
      .br-progress-fill{background:linear-gradient(90deg,#ff6b35,#ef4444);height:100%;transition:width .4s ease;border-radius:6px}
      .br-progress-pct{font-size:13px;color:#ef4444;text-align:right;font-weight:700}
      /* カレンダー */
      .br-cal-wrap{background:#fafafa;border:1px solid #f1f1f1;border-radius:10px;padding:10px;margin-bottom:10px}
      .br-cal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
      .br-cal-title{font-size:12px;font-weight:700;color:#1f2937}
      .br-cal-nav{background:#fff;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer;color:#6b7280;padding:4px 6px;display:flex;align-items:center}
      .br-cal-nav:hover{color:#ef4444;border-color:#fed7aa;background:#fff5f3}
      .br-cal-scope{display:flex;gap:4px;margin-bottom:8px;background:#fff;border-radius:6px;padding:2px;border:1px solid #f1f1f1}
      .br-cal-scope-btn{flex:1;border:none;background:none;padding:5px;font-size:10px;color:#9ca3af;cursor:pointer;border-radius:4px;font-family:inherit;font-weight:500}
      .br-cal-scope-btn:hover{color:#ef4444}
      .br-cal-scope-btn.active{background:linear-gradient(135deg,#ff6b35,#ef4444);color:#fff}
      .br-cal-grid-head{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:4px}
      .br-cal-grid-head span{text-align:center;font-size:10px;color:#9ca3af;font-weight:600}
      .br-cal-grid-head span:first-child{color:#ef4444}
      .br-cal-grid-head span:last-child{color:#60a5fa}
      .br-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
      .br-cal-cell{aspect-ratio:1/1;border-radius:5px;background:#fff;border:1px solid #f1f1f1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:default;min-height:32px}
      .br-cal-cell.br-cal-empty{background:transparent;border:none}
      .br-cal-cell .br-cal-d{font-size:10px;color:#6b7280;line-height:1}
      .br-cal-cell .br-cal-n{font-size:9px;color:#fff;font-weight:700;line-height:1;margin-top:1px}
      .br-cal-cell.br-cal-i0{background:#fff}
      .br-cal-cell.br-cal-i1{background:#ffe8dc;border-color:#ffd5be}
      .br-cal-cell.br-cal-i2{background:#ffb791;border-color:#ff9a6a}
      .br-cal-cell.br-cal-i3{background:#ff8c5a;border-color:#ff7a42}
      .br-cal-cell.br-cal-i4{background:linear-gradient(135deg,#ff6b35,#ef4444);border-color:#ef4444}
      .br-cal-cell.br-cal-i1 .br-cal-d,.br-cal-cell.br-cal-i2 .br-cal-d{color:#1f2937}
      .br-cal-cell.br-cal-i3 .br-cal-d,.br-cal-cell.br-cal-i4 .br-cal-d{color:#fff}
      .br-cal-cell.br-cal-i1 .br-cal-n{color:#ef4444}
      .br-cal-cell.br-cal-i2 .br-cal-n{color:#7c2d12}
      .br-cal-cell.br-cal-today{outline:2px solid #1f2937;outline-offset:-1px}
      .br-cal-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px}
      .br-streak-banner{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);background:linear-gradient(135deg,#1a1a2e 0%,#2d1b69 100%);border:2px solid #6c63ff;border-radius:20px;padding:30px 40px;z-index:1000001;text-align:center;color:#fff;animation:br-streak-pop .5s ease-out forwards;box-shadow:0 20px 60px rgba(108,99,255,.4)}
      @keyframes br-streak-pop{0%{transform:translate(-50%,-50%) scale(0);opacity:0}60%{transform:translate(-50%,-50%) scale(1.1)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
      .br-streak-banner .br-streak-fire{font-size:48px;margin-bottom:8px}
      .br-streak-banner .br-streak-num{font-size:36px;font-weight:900;color:#fbbf24;text-shadow:0 0 20px rgba(251,191,36,.5)}
      .br-streak-banner .br-streak-msg{font-size:14px;color:#a78bfa;margin-top:6px}
      .br-streak-banner .br-streak-close{position:absolute;top:10px;right:14px;background:none;border:none;color:#888;font-size:18px;cursor:pointer}
      .br-x-share-btn{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:#16213e;border:1px solid #2d2d4e;border-radius:6px;color:#aaa;font-size:11px;cursor:pointer;transition:all .2s;margin-left:6px}
      .br-x-share-btn:hover{background:#1d9bf0;color:#fff;border-color:#1d9bf0}
      .br-x-share-btn svg{width:12px;height:12px}
      .br-streak-share{margin-top:12px}
      .br-hl-actions{display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:4px}
      .br-cal-stat{background:#fff;border:1px solid #f1f1f1;border-radius:6px;padding:6px 8px;text-align:center}
      .br-cal-s-val{font-size:16px;font-weight:700;color:#ef4444;line-height:1}
      .br-cal-s-lbl{font-size:10px;color:#6b7280;margin-top:2px}
      .br-btn{background:linear-gradient(135deg,#ff6b35,#ef4444);color:white;border:none;border-radius:6px;padding:9px 12px;cursor:pointer;font-size:12px;width:100%;margin-bottom:7px;font-family:inherit;font-weight:500;box-shadow:0 1px 3px rgba(239,68,68,.2)}
      .br-btn:hover{filter:brightness(1.05)}
      .br-btn.danger{background:#fff;color:#dc2626;border:1px solid #fca5a5;box-shadow:none}
      .br-btn.danger:hover{background:#fef2f2}
      .br-btn.ghost{background:#fff;color:#6b7280;border:1px solid #e5e7eb;box-shadow:none}
      .br-btn.ghost:hover{background:#fafafa;color:#ef4444;border-color:#fed7aa}
      #br-note-modal{display:none;position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:1000002;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
      #br-note-modal.show{display:flex}
      #br-note-inner{background:#fff;border-radius:14px;padding:22px;width:420px;max-width:90vw;box-shadow:0 20px 60px rgba(15,23,42,.25)}
      #br-note-inner h4{margin:0 0 12px;color:#ef4444;font-size:15px;font-weight:700}
      #br-note-sel{background:#fff8f5;border-radius:6px;padding:10px;font-size:12px;color:#4b5563;margin-bottom:12px;max-height:80px;overflow-y:auto;border-left:3px solid #fbbf24;line-height:1.5}
      #br-note-ta{width:100%;background:#fff;border:1px solid #e5e7eb;border-radius:8px;color:#1f2937;padding:11px;font-size:13px;resize:vertical;min-height:100px;box-sizing:border-box;font-family:inherit;line-height:1.5}
      #br-note-ta:focus{outline:none;border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1)}
      .br-modal-btns{display:flex;gap:8px;margin-top:14px;justify-content:flex-end}
      .br-modal-btns button{border:none;border-radius:6px;padding:8px 18px;cursor:pointer;font-size:12px;font-family:inherit;font-weight:500}
      #br-note-save{background:linear-gradient(135deg,#ff6b35,#ef4444);color:white}
      #br-note-cancel{background:#f3f4f6;color:#4b5563}
      .br-search-wrap{position:relative;margin-bottom:10px}
      .br-search-ico{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none;display:flex}
      #br-search{width:100%;background:#fff;border:1px solid #e5e7eb;border-radius:6px;color:#1f2937;padding:8px 11px 8px 30px;font-size:12px;box-sizing:border-box;font-family:inherit}
      #br-search:focus{outline:none;border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1)}
      .br-empty{text-align:center;color:#9ca3af;font-size:12px;padding:24px 12px;line-height:1.7;background:#fafafa;border-radius:8px;border:1px dashed #e5e7eb}
      .br-empty b{color:#ef4444}
      .br-sec-title{font-size:10px;color:#9ca3af;margin:10px 0 6px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600}
      #br-resume{position:fixed!important;top:50%!important;right:48px!important;left:auto!important;bottom:auto!important;transform:translateY(-50%) translateX(0)!important;background:#fff;border:1px solid #fed7aa;border-radius:10px 0 0 10px;padding:10px 12px;z-index:999997;display:flex;gap:10px;align-items:center;box-shadow:-4px 4px 16px rgba(239,68,68,.18);max-width:260px;animation:brFadeR .3s ease}
      @keyframes brFadeR{from{opacity:0;transform:translateY(-50%) translateX(20px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}
      #br-resume.br-hidden-by-panel{display:none}
      .br-resume-body{flex:1;min-width:0}
      .br-resume-text{font-size:10px;color:#9ca3af;line-height:1.2}
      .br-resume-title{font-size:12px;color:#1f2937;margin-top:2px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}
      #br-resume-go{background:linear-gradient(135deg,#ff6b35,#ef4444);color:white;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:11px;white-space:nowrap;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:4px}
      #br-resume-x{background:none;border:none;color:#9ca3af;cursor:pointer;padding:2px;display:flex;align-items:center}
      #br-resume-x:hover{color:#ef4444}
      /* チュートリアル */
      #br-tutorial{position:fixed;inset:0;z-index:1000005;display:none;pointer-events:none}
      #br-tutorial.show{display:block}
      #br-tutorial-mask{position:absolute;inset:0;background:rgba(15,23,42,.55);pointer-events:auto;backdrop-filter:blur(1px)}
      #br-tutorial-card{position:absolute;background:#fff;border-radius:14px;padding:20px 22px;width:360px;max-width:92vw;box-shadow:0 20px 60px rgba(15,23,42,.4);pointer-events:auto;border-top:4px solid #ef4444}
      #br-tutorial-card h4{margin:0 0 8px;color:#ef4444;font-size:16px;font-weight:700}
      #br-tutorial-step{font-size:11px;color:#9ca3af;font-weight:600;letter-spacing:1px;margin-bottom:4px}
      #br-tutorial-body{font-size:13px;color:#374151;line-height:1.7;margin-bottom:14px}
      #br-tutorial-body kbd{background:#fff5f3;border:1px solid #fed7aa;border-radius:4px;padding:1px 6px;font-size:11px;color:#ef4444;font-family:inherit}
      #br-tutorial-body .br-tip{background:#fff8f5;border-left:3px solid #ff6b35;padding:8px 10px;border-radius:4px;margin-top:8px;font-size:12px;color:#6b7280}
      .br-tut-btns{display:flex;justify-content:space-between;align-items:center;gap:8px}
      .br-tut-btns .br-tut-skip{background:none;border:none;color:#9ca3af;cursor:pointer;font-size:11px;font-family:inherit}
      .br-tut-btns .br-tut-skip:hover{color:#ef4444}
      .br-tut-nav{display:flex;gap:8px}
      .br-tut-nav button{border:none;border-radius:6px;padding:7px 16px;cursor:pointer;font-size:12px;font-family:inherit;font-weight:500}
      .br-tut-prev{background:#f3f4f6;color:#4b5563}
      .br-tut-next{background:linear-gradient(135deg,#ff6b35,#ef4444);color:white}
      #br-tutorial-spot{position:absolute;border:3px solid #ff6b35;border-radius:8px;box-shadow:0 0 0 9999px rgba(15,23,42,.55),0 0 24px rgba(239,68,68,.5);pointer-events:none;transition:all .3s ease;display:none}
      #br-tutorial-spot.show{display:block}
      /* ヘルプタブ */
      .br-help-block{background:#fafafa;border:1px solid #f1f1f1;border-radius:8px;padding:12px 14px;margin-bottom:10px}
      .br-help-block h5{margin:0 0 8px;color:#ef4444;font-size:13px;font-weight:700;display:flex;align-items:center;gap:7px}
      .br-help-block h5 svg{stroke:#ef4444}
      .br-help-block p{margin:4px 0;font-size:12px;color:#4b5563;line-height:1.7}
      .br-help-block kbd{background:#fff5f3;border:1px solid #fed7aa;border-radius:4px;padding:1px 6px;font-size:11px;color:#ef4444}
      .br-help-block .br-step{display:flex;gap:8px;align-items:flex-start;margin:6px 0}
      .br-help-block .br-step-num{background:#ef4444;color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;margin-top:1px}
    `;
    document.head.appendChild(style);

    // ===== SVGアイコン =====
    const ICON = {
      list:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
      bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
      bookmarkFill:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
      highlighter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l-6 6v3h3l6-6"/><path d="M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
      chart:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
      help:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      x:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      trash:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
      copy:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
      pencil:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
      check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
      play:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>',
      arrowRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
      grad:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
    };
    function svg(name, size) {
      const s = size || 18;
      const raw = ICON[name] || '';
      return raw.replace('<svg ', `<svg width="${s}" height="${s}" style="display:block;flex-shrink:0" `);
    }

    // ===== ストレージ =====
    function hashKey(s) {
      let h = 5381 >>> 0;
      for (let i = 0; i < s.length; i++) h = (((h << 5) + h) + s.charCodeAt(i)) >>> 0;
      return h.toString(36);
    }
    function storageKey() {
      const id = location.pathname + location.search;
      return 'brain_reader_' + hashKey(id) + '_' + encodeURIComponent(location.pathname).replace(/[^a-zA-Z0-9]/g,'').slice(-24);
    }
    let SK = storageKey();

    // ===== ストレージ抽象化（chrome.storage.sync + localStorage フォールバック）=====
    const useSync = !!(typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync);
    function loadSt() {
      const def = {bookmarks:[],highlights:[],readSections:[],lastPosition:0,activityLog:{}};
      try { const d=localStorage.getItem(SK); const p=d?JSON.parse(d):{}; return Object.assign({}, def, p, {activityLog: p.activityLog || {}}); }
      catch(e) { return def; }
    }
    function saveSt() {
      try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}
      // chrome.storage.sync にアクティビティログを同期（容量制限対策: ログのみsync）
      if (useSync) {
        try {
          chrome.storage.sync.set({ [ACT_GLOBAL_KEY]: loadGlobalActivity() });
        } catch(e) {}
      }
    }
    let ST = loadSt();

    // ===== 学習アクティビティ =====
    const ACT_GLOBAL_KEY = 'brain_reader_activity_global';
    function todayKey() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    }
    function loadGlobalActivity() {
      try { return JSON.parse(localStorage.getItem(ACT_GLOBAL_KEY)) || {}; } catch(e) { return {}; }
    }
    function saveGlobalActivity(a) {
      try { localStorage.setItem(ACT_GLOBAL_KEY, JSON.stringify(a)); } catch(e) {}
      if (useSync) { try { chrome.storage.sync.set({ [ACT_GLOBAL_KEY]: a }); } catch(e) {} }
    }
    // 起動時にchrome.storage.syncからアクティビティログを復元（他端末のデータをマージ）
    if (useSync) {
      try {
        chrome.storage.sync.get([ACT_GLOBAL_KEY], result => {
          const remote = result[ACT_GLOBAL_KEY];
          if (remote && typeof remote === 'object') {
            const local = loadGlobalActivity();
            // マージ: 各日付でsectionsが大きい方を採用
            Object.keys(remote).forEach(k => {
              const r = remote[k], l = local[k];
              if (!l || (r && r.sections > (l.sections||0))) local[k] = r;
            });
            try { localStorage.setItem(ACT_GLOBAL_KEY, JSON.stringify(local)); } catch(e) {}
          }
        });
      } catch(e) {}
    }
    function recordActivity(sectionDelta, scrollDelta) {
      const k = todayKey();
      if (!ST.activityLog) ST.activityLog = {};
      const cur = ST.activityLog[k] || {sections:0, scrollPx:0};
      cur.sections += sectionDelta || 0;
      cur.scrollPx += scrollDelta || 0;
      ST.activityLog[k] = cur;
      // グローバル集計（全記事合計）
      const g = loadGlobalActivity();
      const gc = g[k] || {sections:0, scrollPx:0, articles:{}};
      gc.sections += sectionDelta || 0;
      gc.scrollPx += scrollDelta || 0;
      if (!gc.articles) gc.articles = {};
      gc.articles[location.pathname] = (gc.articles[location.pathname] || 0) + (sectionDelta || 0);
      g[k] = gc;
      saveGlobalActivity(g);
    }

    // ===== ページ判定 =====
    function isTopPage() {
      const p = location.pathname.replace(/\/+$/,'');
      return p === '' || p === '/top' || p === '/home';
    }
  
    // ===== UI構築 =====
    const pb = document.createElement('div');
    pb.id = 'brain-progress-bar'; pb.style.width = '0%';
    document.body.appendChild(pb);
  
    const toggle = document.createElement('button');
    toggle.id = 'brain-reader-toggle'; toggle.innerHTML = svg('book', 22); toggle.title = '学習アシストを開く';
    document.body.appendChild(toggle);
  
    const hlPop = document.createElement('div');
    hlPop.id = 'br-highlight-popup';
    hlPop.innerHTML = `<button class="br-color-btn yellow" data-color="yellow" title="黄でハイライト"></button><button class="br-color-btn green" data-color="green" title="緑でハイライト"></button><button class="br-color-btn red" data-color="red" title="赤でハイライト"></button><button class="br-color-btn blue" data-color="blue" title="青でハイライト"></button><button id="br-add-note-btn" title="メモを追加">${svg('pencil',14)}</button>`;
    document.body.appendChild(hlPop);
  
    const modal = document.createElement('div');
    modal.id = 'br-note-modal';
    modal.innerHTML = `<div id="br-note-inner"><h4><span style="display:inline-flex;vertical-align:middle;margin-right:6px">${svg('pencil',16)}</span>メモを追加</h4><div id="br-note-sel"></div><textarea id="br-note-ta" placeholder="このテキストへのメモ..."></textarea><div class="br-modal-btns"><button id="br-note-cancel">キャンセル</button><button id="br-note-save">保存</button></div></div>`;
    document.body.appendChild(modal);
  
    const panel = document.createElement('div');
    panel.id = 'brain-reader-panel';
    panel.innerHTML = `
      <div id="brain-reader-header">
        <div class="br-title">${svg('book',16)}<span>Brain Reader</span></div>
        <div class="br-h-actions">
          <button id="br-cls" title="閉じる">${svg('x',16)}</button>
        </div>
      </div>
      <div id="brain-reader-tabs">
        <button class="br-tab active" data-tab="toc" title="目次">${svg('list',18)}</button>
        <button class="br-tab" data-tab="bm" title="栞">${svg('bookmark',18)}</button>
        <button class="br-tab" data-tab="hl" title="ハイライト">${svg('highlighter',18)}</button>
        <button class="br-tab" data-tab="stats" title="統計">${svg('chart',18)}</button>
        <button class="br-tab" data-tab="help" title="使い方">${svg('help',18)}</button>
      </div>
      <div id="brain-reader-content">
        <div class="br-section active" id="br-s-toc">
          <div class="br-search-wrap"><span class="br-search-ico">${svg('search',14)}</span><input type="text" id="br-search" placeholder="セクション検索..."></div>
          <div id="br-toc-list"></div>
        </div>
        <div class="br-section" id="br-s-bm">
          <div class="br-sec-title">保存した栞</div>
          <div id="br-bm-list"></div>
        </div>
        <div class="br-section" id="br-s-hl">
          <button class="br-btn" id="br-export" style="margin-bottom:10px;"><span style="display:inline-flex;vertical-align:middle;margin-right:6px">${svg('copy',14)}</span>Markdownでコピー</button>
          <div id="br-hl-list"></div>
        </div>
        <div class="br-section" id="br-s-stats">
          <div id="br-stats"></div>
        </div>
        <div class="br-section" id="br-s-help">
          <div class="br-help-block">
            <h5>${svg('bookmark',14)}<span>栞（ブックマーク）の使い方</span></h5>
            <div class="br-step"><span class="br-step-num">1</span><div>本文の<b>見出し（h2/h3/h4）にマウスを乗せる</b>と、見出しの右側にオレンジの<b>栞ボタン</b>が現れます。</div></div>
            <div class="br-step"><span class="br-step-num">2</span><div>栞ボタンをクリックすると、その見出しが栞として保存されます。</div></div>
            <div class="br-step"><span class="br-step-num">3</span><div>栞タブで栞一覧が確認でき、クリックで該当見出しへジャンプ。削除アイコンで削除できます。</div></div>
            <div class="br-step"><span class="br-step-num">4</span><div>もう一度同じ見出しの栞ボタンを押すと、栞が解除されます。</div></div>
          </div>
          <div class="br-help-block">
            <h5>${svg('highlighter',14)}<span>ハイライト・メモの使い方</span></h5>
            <div class="br-step"><span class="br-step-num">1</span><div>本文中の<b>テキストを3文字以上ドラッグで選択</b>します。</div></div>
            <div class="br-step"><span class="br-step-num">2</span><div>選択範囲の上にカラーパレットが現れます。<b>4色</b>からマーカー色を選択。</div></div>
            <div class="br-step"><span class="br-step-num">3</span><div>ペンアイコンを押すと、メモ付きハイライトとして保存できます。</div></div>
            <div class="br-step"><span class="br-step-num">4</span><div><kbd>Alt</kbd>＋ハイライト部分をクリックで個別削除できます。</div></div>
            <div class="br-step"><span class="br-step-num">5</span><div>ハイライトタブの「Markdownでコピー」で全ハイライトを書き出せます。</div></div>
          </div>
          <div class="br-help-block">
            <h5>${svg('list',14)}<span>目次・既読管理</span></h5>
            <p>目次タブから任意のセクションへワンクリック移動。スクロール時に画面上部に来た見出しは<b>自動的に既読</b>として記録されます（緑チェック）。</p>
            <p>検索ボックスでセクション名を絞り込めます。</p>
          </div>
          <div class="br-help-block">
            <h5>${svg('chart',14)}<span>進捗・再開</span></h5>
            <p>統計タブで読書進捗を確認。次回ページを開いたときに<b>続きから再開バナー</b>が表示されます。</p>
            <p>画面最上部のオレンジバーは現在のスクロール位置を示します。</p>
          </div>
          <button class="br-btn" id="br-tut-restart"><span style="display:inline-flex;vertical-align:middle;margin-right:6px">${svg('grad',14)}</span>チュートリアルをもう一度見る</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  
    // ===== Xシェア & ストリーク演出 =====
    function xSvg() { return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'; }
    // アフィリエイトリンク(brmk.io)の自動傍受
    let _affiliateURL = null;
    // window.openを傍受して、BrainのXシェアボタンからbrmk.ioリンクをキャプチャ
    const _origWindowOpen = window.open;
    window.open = function(url) {
      if (url && typeof url === 'string' && url.includes('brmk.io')) {
        const m = url.match(/(?:url=)?(https?(?:%3A%2F%2F|:\/\/)brmk\.io(?:%2F|\/)[\w]+)/i);
        if (m) {
          try { _affiliateURL = decodeURIComponent(m[1]); } catch(e) { _affiliateURL = m[1]; }
          // 記事ごとにlocalStorageにキャッシュ
          try { localStorage.setItem('br_aff_' + location.pathname, _affiliateURL); } catch(e) {}
          toast('🔗 アフィリリンクを検出！今後のシェアに自動で含まれます');
        }
      }
      return _origWindowOpen.apply(this, arguments);
    };
    function getAffiliateURL() {
      // 1. メモリキャッシュ
      if (_affiliateURL) return _affiliateURL;
      // 2. localStorageキャッシュ（前回検出分）
      try {
        const cached = localStorage.getItem('br_aff_' + location.pathname);
        if (cached && cached.includes('brmk.io')) { _affiliateURL = cached; return cached; }
      } catch(e) {}
      // 3. 見つからない場合null
      return null;
    }
    function resetAffiliateCache() { _affiliateURL = null; }
    function shareOnX(text) {
      const affURL = getAffiliateURL();
      if (affURL) {
        const fullText = text + '\n' + affURL;
        const url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(fullText);
        _origWindowOpen.call(window, url, '_blank', 'width=550,height=420');
      } else {
        // アフィリリンク未検出 → 記事URLなしでポスト + ヒント表示
        const url = 'https://x.com/intent/tweet?text=' + encodeURIComponent(text);
        _origWindowOpen.call(window, url, '_blank', 'width=550,height=420');
        toast('💡 Tip: 先にBrainの「Xでシェア」ボタンを1回押すと、アフィリリンクが自動検出されます');
      }
    }
    function calcStreak() {
      const log = loadGlobalActivity();
      let streak = 0, cursor = new Date();
      while (true) {
        const k = cursor.getFullYear()+'-'+String(cursor.getMonth()+1).padStart(2,'0')+'-'+String(cursor.getDate()).padStart(2,'0');
        const v = log[k];
        const sec = v ? (typeof v === 'number' ? v : (v.sections||0)) : 0;
        if (sec > 0) { streak++; cursor.setDate(cursor.getDate()-1); } else break;
        if (streak > 365) break;
      }
      return streak;
    }
    function showStreakCelebration() {
      const streak = calcStreak();
      if (streak < 2) return;
      // 3日未満はトーストのみ
      if (streak < 5) { toast(`🔥 ${streak}日連続学習中！`); return; }
      // 5日以上はバナー演出
      let emoji = '🔥', msg = 'いい調子！';
      if (streak >= 30) { emoji = '🏆'; msg = '圧倒的継続力！'; }
      else if (streak >= 14) { emoji = '⚡'; msg = '学習が習慣になってる！'; }
      else if (streak >= 7) { emoji = '🔥'; msg = 'すごい！1週間突破！'; }
      const banner = document.createElement('div');
      banner.className = 'br-streak-banner';
      const monthLog = loadGlobalActivity();
      const now = new Date();
      const monthKey = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
      let monthSec = 0;
      Object.keys(monthLog).forEach(k => { if (k.startsWith(monthKey)) { const v = monthLog[k]; monthSec += v ? (typeof v==='number'?v:(v.sections||0)) : 0; } });
      const shareText = `Brain学習 ${emoji} ${streak}日連続中！今月${monthSec}セクション読了📚 #Brain学習 #継続は力なり`;
      banner.innerHTML = `
        <button class="br-streak-close" title="閉じる">✕</button>
        <div class="br-streak-fire">${emoji}</div>
        <div class="br-streak-num">${streak}日連続！</div>
        <div class="br-streak-msg">${msg}</div>
        <div class="br-streak-share">
          <button class="br-x-share-btn" id="br-streak-x-btn">${xSvg()} ポストする</button>
        </div>`;
      document.body.appendChild(banner);
      banner.querySelector('.br-streak-close').addEventListener('click', () => banner.remove());
      banner.querySelector('#br-streak-x-btn').addEventListener('click', () => shareOnX(shareText));
      setTimeout(() => { if (banner.parentNode) banner.remove(); }, 8000);
    }

    // ===== ヘルパー関数 =====
    function toast(msg, err) {
      let t = document.getElementById('br-toast');
      if (!t) { t=document.createElement('div'); t.id='br-toast'; t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);color:white;padding:10px 18px;border-radius:8px;font-size:13px;z-index:1000003;box-shadow:0 4px 15px rgba(0,0,0,.4);pointer-events:none;font-family:-apple-system,sans-serif;transition:opacity .3s;'; document.body.appendChild(t); }
      t.style.background = err ? '#dc2626' : '#6c63ff';
      t.textContent = msg; t.style.opacity = '1';
      clearTimeout(t._t); t._t = setTimeout(()=>t.style.opacity='0', 2500);
    }
  
    function getBody() { return document.querySelector('._body_vrp2u_275') || document.querySelector('.body'); }
  
    // ===== 目次構築 =====
    function buildTOC() {
      const body = getBody();
      const list = document.getElementById('br-toc-list');
      const scroller = document.getElementById('brain-reader-content');
      if (!body || !list) return;
      const prevScroll = scroller ? scroller.scrollTop : 0;
      list.innerHTML = '';
      body.querySelectorAll('h2,h3,h4').forEach(h => {
        const div = document.createElement('div');
        const read = ST.readSections.includes(h.id);
        div.className = 'br-toc-item ' + h.tagName.toLowerCase() + (read ? ' read' : '');
        div.setAttribute('data-heading-id', h.id);
        const checkIco = read ? svg('check',11) : '<span class="br-dot-mark">·</span>';
        const bmIco = ST.bookmarks.some(b=>b.id===h.id) ? '<span class="br-bm-dot"></span>' : '';
        div.innerHTML = `<span class="br-check">${checkIco}</span>${bmIco}<span class="br-toc-txt">${escapeHtml(h.innerText.substring(0,55))}</span>`;
        div.addEventListener('click', () => {
          const t = document.getElementById(h.id);
          if (t) {
            t.scrollIntoView({behavior:'smooth', block:'start'});
            if (!ST.readSections.includes(h.id)) {
              ST.readSections.push(h.id); saveSt();
              div.classList.add('read');
              const ck = div.querySelector('.br-check'); if (ck) ck.innerHTML = svg('check',11);
            }
            markActiveTOC(h.id);
          }
        });
        list.appendChild(div);
      });
      if (scroller) scroller.scrollTop = prevScroll;
      syncTOCToScroll();
    }

    // ===== TOC位置同期 =====
    let currentActiveId = null;
    function markActiveTOC(id) {
      if (currentActiveId === id) return;
      const list = document.getElementById('br-toc-list'); if (!list) return;
      list.querySelectorAll('.br-toc-item.active').forEach(x => x.classList.remove('active'));
      const el = list.querySelector(`.br-toc-item[data-heading-id="${id}"]`);
      if (el) {
        el.classList.add('active');
        const scroller = document.getElementById('brain-reader-content');
        if (scroller) {
          const er = el.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
          if (er.top < sr.top + 40 || er.bottom > sr.bottom - 40) {
            scroller.scrollTop += (er.top - sr.top) - scroller.clientHeight / 2 + el.clientHeight / 2;
          }
        }
      }
      currentActiveId = id;
    }
    function syncTOCToScroll() {
      const body = getBody(); if (!body) return;
      const hs = body.querySelectorAll('h2,h3,h4');
      let cur = null;
      for (const h of hs) {
        if (h.getBoundingClientRect().top < 120) cur = h;
        else break;
      }
      if (cur && cur.id) markActiveTOC(cur.id);
    }
  
    // ===== 栞 =====
    function renderBM() {
      const list = document.getElementById('br-bm-list'); if (!list) return;
      if (!ST.bookmarks.length) { list.innerHTML='<div class="br-empty">栞はまだありません。<br>本文見出しにカーソルを重ねると出現する<br><b>栞ボタン</b>で追加できます。</div>'; return; }
      list.innerHTML = '';
      ST.bookmarks.slice().reverse().forEach(bm => {
        const it = document.createElement('div');
        it.className = 'br-bookmark-item';
        it.innerHTML = `<div class="bm-title">${escapeHtml(bm.text)}</div><div class="bm-meta"><span>${bm.date}</span><button class="bm-del" title="削除">${svg('trash',14)}</button></div>`;
        it.addEventListener('click', e => {
          if (e.target.classList.contains('bm-del')) return;
          const t = document.getElementById(bm.id);
          if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
          else window.scrollTo({top: bm.position, behavior:'smooth'});
        });
        it.querySelector('.bm-del').addEventListener('click', e => {
          e.stopPropagation();
          ST.bookmarks = ST.bookmarks.filter(x => x.id !== bm.id);
          saveSt(); renderBM(); buildTOC(); updateStats();
          toast('栞を削除しました');
        });
        list.appendChild(it);
      });
    }

    function toggleBM(h) {
      const idx = ST.bookmarks.findIndex(b => b.id === h.id);
      if (idx >= 0) {
        ST.bookmarks.splice(idx, 1);
        toast('栞を削除しました');
      } else {
        ST.bookmarks.push({
          id: h.id,
          text: h.innerText.substring(0, 60),
          position: h.offsetTop,
          date: new Date().toLocaleDateString('ja-JP')
        });
        toast('栞を追加しました');
      }
      saveSt(); renderBM(); buildTOC(); updateStats();
    }

    // ===== ハイライト =====
    function renderHL() {
      const list = document.getElementById('br-hl-list'); if (!list) return;
      if (!ST.highlights.length) { list.innerHTML='<div class="br-empty">ハイライトはまだありません。<br>本文のテキストを3文字以上<br>ドラッグ選択して色を選んでください。</div>'; return; }
      list.innerHTML = '';
      ST.highlights.slice().reverse().forEach(hl => {
        const it = document.createElement('div');
        it.className = 'br-hl-item';
        it.style.borderLeftColor = ({yellow:'#fbbf24',green:'#34d399',red:'#f87171',blue:'#60a5fa'})[hl.color] || '#fbbf24';
        it.innerHTML = `
          <div class="br-hl-text">「${escapeHtml(hl.text.substring(0,100))}${hl.text.length>100?'...':''}」</div>
          ${hl.note?`<div class="br-hl-note"><span style="display:inline-flex;vertical-align:middle;margin-right:4px">${svg('pencil',11)}</span>${escapeHtml(hl.note)}</div>`:''}
          <div class="br-hl-meta"><span>${escapeHtml(hl.section||'')}</span><span>${hl.date}</span></div>
          <div class="br-hl-actions"><button class="br-x-share-btn br-hl-x-btn" title="Xでポスト">${xSvg()} ポスト</button><button class="bm-del" title="削除">${svg('trash',14)}</button></div>`;
        it.querySelector('.br-hl-x-btn').addEventListener('click', e => {
          e.stopPropagation();
          const quote = hl.text.length > 80 ? hl.text.substring(0,80)+'…' : hl.text;
          let txt = `📖「${quote}」`;
          if (hl.note) txt += `\n💡 ${hl.note}`;
          txt += `\n\n#Brain学習 #読書メモ`;
          shareOnX(txt);
        });
        it.querySelector('.bm-del').addEventListener('click', e => {
          e.stopPropagation();
          unwrapHighlightSpans(hl.id);
          ST.highlights = ST.highlights.filter(x => x.id !== hl.id);
          saveSt(); renderHL(); updateStats();
          toast('ハイライトを削除しました');
        });
        it.addEventListener('click', e => {
          if (e.target.classList.contains('bm-del')) return;
          const span = document.querySelector(`span[data-hl-id="${hl.id}"]`);
          if (span) span.scrollIntoView({behavior:'smooth', block:'center'});
        });
        list.appendChild(it);
      });
    }

    function getCurrentSection() {
      const body = getBody(); if (!body) return '';
      const hs = body.querySelectorAll('h2,h3,h4');
      let cur = '';
      for (const h of hs) {
        if (h.getBoundingClientRect().top < 100) cur = h.innerText.substring(0, 50);
        else break;
      }
      return cur;
    }

    // 範囲内のテキストノードを全て取得
    function collectTextNodes(range) {
      const nodes = [];
      const root = range.commonAncestorContainer;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: n => {
          if (!n.nodeValue || !n.nodeValue.length) return NodeFilter.FILTER_REJECT;
          if (n.parentNode && n.parentNode.closest('.br-highlight')) return NodeFilter.FILTER_REJECT;
          try { if (!range.intersectsNode(n)) return NodeFilter.FILTER_REJECT; } catch(e) { return NodeFilter.FILTER_REJECT; }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n; while ((n = walker.nextNode())) nodes.push(n);
      // rootがテキストノード単体の場合
      if (root.nodeType === 3 && !nodes.length) nodes.push(root);
      return nodes;
    }

    // 範囲を複数のspanで分割ラップ（複数行/複数段落対応）
    function wrapRangeMulti(range, id, color, note) {
      const startC = range.startContainer, startO = range.startOffset;
      const endC = range.endContainer, endO = range.endOffset;
      const nodes = collectTextNodes(range);
      const created = [];
      for (const tn of nodes) {
        const full = tn.nodeValue;
        let s = 0, e = full.length;
        if (tn === startC) s = startO;
        if (tn === endC) e = endO;
        if (s >= e) continue;
        const before = full.slice(0, s);
        const middle = full.slice(s, e);
        const after = full.slice(e);
        if (!middle) continue;
        const span = document.createElement('span');
        span.className = 'br-highlight br-highlight-' + color;
        span.setAttribute('data-hl-id', id);
        if (note) span.title = note;
        span.textContent = middle;
        const parent = tn.parentNode;
        if (!parent) continue;
        if (after) parent.insertBefore(document.createTextNode(after), tn.nextSibling);
        parent.insertBefore(span, tn.nextSibling);
        if (before) tn.nodeValue = before; else parent.removeChild(tn);
        created.push(span);
      }
      return created;
    }

    function applyHighlight(color, note) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const text = sel.toString();
      if (text.length < 3) { toast('3文字以上を選択してください', true); return; }
      const id = 'hl_' + Date.now();
      let spans = [];
      try {
        spans = wrapRangeMulti(range, id, color, note);
      } catch(e) { spans = []; }
      if (!spans.length) {
        toast('この範囲はハイライトできません', true);
        return;
      }
      ST.highlights.push({
        id, text: text.substring(0, 200), color, note: note||'',
        section: getCurrentSection(), date: new Date().toLocaleDateString('ja-JP')
      });
      saveSt(); renderHL(); updateStats();
      sel.removeAllRanges();
      hlPop.classList.remove('show');
      toast('ハイライトを保存しました');
    }

    // 選択時にポップアップ表示
    document.addEventListener('mouseup', e => {
      if (e.target.closest('#brain-reader-panel') || e.target.closest('#br-highlight-popup') || e.target.closest('#br-note-modal')) return;
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) { hlPop.classList.remove('show'); return; }
        const body = getBody();
        if (!body || !body.contains(sel.anchorNode)) { hlPop.classList.remove('show'); return; }
        const r = sel.getRangeAt(0).getBoundingClientRect();
        hlPop.style.left = (window.scrollX + r.left + r.width/2 - 110) + 'px';
        hlPop.style.top = (window.scrollY + r.top - 48) + 'px';
        hlPop.classList.add('show');
      }, 10);
    });

    hlPop.addEventListener('mousedown', e => e.preventDefault());
    hlPop.querySelectorAll('.br-color-btn').forEach(b => {
      b.addEventListener('click', () => applyHighlight(b.dataset.color, ''));
    });
    document.getElementById('br-add-note-btn').addEventListener('click', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const txt = sel.toString();
      pendingRange = sel.getRangeAt(0).cloneRange();
      pendingText = txt;
      document.getElementById('br-note-sel').textContent = txt.substring(0, 200);
      document.getElementById('br-note-ta').value = '';
      modal.classList.add('show');
      hlPop.classList.remove('show');
      setTimeout(() => document.getElementById('br-note-ta').focus(), 50);
    });

    let pendingRange = null, pendingText = '';
    document.getElementById('br-note-save').addEventListener('click', () => {
      const note = document.getElementById('br-note-ta').value.trim();
      if (pendingRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(pendingRange);
        applyHighlight('yellow', note);
      }
      modal.classList.remove('show');
      pendingRange = null;
    });
    document.getElementById('br-note-cancel').addEventListener('click', () => {
      modal.classList.remove('show'); pendingRange = null;
    });

    // 同一IDの全てのハイライトspanを解除
    function unwrapHighlightSpans(id) {
      document.querySelectorAll(`span.br-highlight[data-hl-id="${id}"]`).forEach(span => {
        const p = span.parentNode; if (!p) return;
        while (span.firstChild) p.insertBefore(span.firstChild, span);
        p.removeChild(span);
        p.normalize && p.normalize();
      });
    }

    // Alt+クリックで削除
    document.addEventListener('click', e => {
      if (!e.altKey) return;
      const span = e.target.closest('.br-highlight');
      if (!span) return;
      const id = span.getAttribute('data-hl-id');
      unwrapHighlightSpans(id);
      ST.highlights = ST.highlights.filter(x => x.id !== id);
      saveSt(); renderHL(); updateStats();
      toast('ハイライトを削除しました');
    });

    // 既存ハイライトをDOMに復元
    function restoreHighlights() {
      const body = getBody(); if (!body) return;
      ST.highlights.forEach(hl => {
        if (document.querySelector(`span[data-hl-id="${hl.id}"]`)) return;
        // 単一テキストノード内にある場合は直接検索
        const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
        let n, found = false;
        while ((n = walker.nextNode())) {
          if (n.parentNode.closest('.br-highlight')) continue;
          const idx = n.nodeValue.indexOf(hl.text);
          if (idx >= 0) {
            try {
              const r = document.createRange();
              r.setStart(n, idx);
              r.setEnd(n, idx + hl.text.length);
              wrapRangeMulti(r, hl.id, hl.color, hl.note);
              found = true;
            } catch(e) {}
            break;
          }
        }
        // 複数ノードにまたがる場合: body全文を連結して位置を特定
        if (!found) {
          const w2 = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
            acceptNode: tn => (tn.parentNode && tn.parentNode.closest('.br-highlight')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
          });
          const tns = []; let tn; let full = '';
          while ((tn = w2.nextNode())) { tns.push({node: tn, start: full.length}); full += tn.nodeValue; }
          const pos = full.indexOf(hl.text);
          if (pos >= 0) {
            let startNode = null, startOff = 0, endNode = null, endOff = 0;
            const endPos = pos + hl.text.length;
            for (const entry of tns) {
              const entryEnd = entry.start + entry.node.nodeValue.length;
              if (!startNode && pos < entryEnd) { startNode = entry.node; startOff = pos - entry.start; }
              if (!endNode && endPos <= entryEnd) { endNode = entry.node; endOff = endPos - entry.start; break; }
            }
            if (startNode && endNode) {
              try {
                const r = document.createRange();
                r.setStart(startNode, startOff);
                r.setEnd(endNode, endOff);
                wrapRangeMulti(r, hl.id, hl.color, hl.note);
              } catch(e) {}
            }
          }
        }
      });
    }

    // ===== 見出しへの栞ボタン =====
    function addHeadingActions() {
      const body = getBody(); if (!body) return;
      body.querySelectorAll('h2,h3,h4').forEach(h => {
        if (h.querySelector('.br-heading-actions')) return;
        if (!h.id) return;
        const wrap = document.createElement('span');
        wrap.className = 'br-heading-actions';
        const isBm = ST.bookmarks.some(b => b.id === h.id);
        wrap.innerHTML = `<button class="br-btn-bm${isBm?' active':''}" title="栞の追加/削除">${svg(isBm?'bookmarkFill':'bookmark',13)}</button>`;
        wrap.querySelector('.br-btn-bm').addEventListener('click', e => {
          e.stopPropagation(); e.preventDefault();
          toggleBM(h);
          const b = wrap.querySelector('.br-btn-bm');
          const nowBm = ST.bookmarks.some(x => x.id === h.id);
          if (b) { b.classList.toggle('active', nowBm); b.innerHTML = svg(nowBm?'bookmarkFill':'bookmark',13); }
        });
        h.appendChild(wrap);
      });
    }

    // ===== 統計 =====
    let calendarView = (() => { const d = new Date(); return {year:d.getFullYear(), month:d.getMonth(), scope:'global'}; })();
    function calendarHTML() {
      const y = calendarView.year, m = calendarView.month;
      const first = new Date(y, m, 1);
      const last = new Date(y, m+1, 0);
      const daysInMonth = last.getDate();
      const startWeekday = first.getDay();
      const monthStr = `${y}年${m+1}月`;
      const log = calendarView.scope === 'article' ? (ST.activityLog || {}) : loadGlobalActivity();
      // 正規化: 記事別は {sections,scrollPx} 形式、グローバルも同じ
      const getDay = k => {
        const v = log[k]; if (!v) return null;
        if (typeof v === 'number') return {sections:v, scrollPx:0};
        return v;
      };
      // 最大値で強度を計算
      let maxSec = 0;
      Object.keys(log).forEach(k => { const v = getDay(k); if (v && v.sections > maxSec) maxSec = v.sections; });
      const today = todayKey();
      const cells = [];
      for (let i=0; i<startWeekday; i++) cells.push('<div class="br-cal-cell br-cal-empty"></div>');
      let studyDays = 0, monthSec = 0, monthPx = 0;
      for (let d=1; d<=daysInMonth; d++) {
        const k = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const a = getDay(k);
        const sec = a ? a.sections : 0;
        const px = a ? a.scrollPx : 0;
        if (sec > 0) { studyDays++; monthSec += sec; monthPx += px; }
        const intensity = sec > 0 ? Math.min(4, Math.ceil((sec/Math.max(1,maxSec))*4)) : 0;
        const isToday = k === today;
        const title = a ? `${k}\n既読: ${sec}セクション\nスクロール: ${Math.round(px/1000)}kpx` : `${k} (学習なし)`;
        cells.push(`<div class="br-cal-cell br-cal-i${intensity}${isToday?' br-cal-today':''}" title="${title}" data-day="${k}"><span class="br-cal-d">${d}</span>${sec?`<span class="br-cal-n">${sec}</span>`:''}</div>`);
      }
      // Streak計算
      let streak = 0, cursor = new Date();
      while (true) {
        const k = cursor.getFullYear()+'-'+String(cursor.getMonth()+1).padStart(2,'0')+'-'+String(cursor.getDate()).padStart(2,'0');
        const a = getDay(k);
        if (a && a.sections > 0) { streak++; cursor.setDate(cursor.getDate()-1); } else break;
        if (streak > 365) break;
      }
      return `
        <div class="br-cal-wrap">
          <div class="br-cal-head">
            <button class="br-cal-nav" id="br-cal-prev" title="前月">${svg('arrowRight',14).replace('<svg','<svg style="transform:rotate(180deg)"')}</button>
            <div class="br-cal-title">${monthStr}</div>
            <button class="br-cal-nav" id="br-cal-next" title="次月">${svg('arrowRight',14)}</button>
          </div>
          <div class="br-cal-scope">
            <button class="br-cal-scope-btn${calendarView.scope==='global'?' active':''}" data-scope="global">全記事</button>
            <button class="br-cal-scope-btn${calendarView.scope==='article'?' active':''}" data-scope="article">この記事のみ</button>
          </div>
          <div class="br-cal-grid-head">
            <span>日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span>
          </div>
          <div class="br-cal-grid">${cells.join('')}</div>
          <div class="br-cal-summary">
            <div class="br-cal-stat"><div class="br-cal-s-val">${studyDays}</div><div class="br-cal-s-lbl">学習日</div></div>
            <div class="br-cal-stat"><div class="br-cal-s-val">${monthSec}</div><div class="br-cal-s-lbl">セクション</div></div>
            <div class="br-cal-stat"><div class="br-cal-s-val">${streak}</div><div class="br-cal-s-lbl">連続日数</div></div>
          </div>
          ${streak >= 2 ? `<div style="text-align:center;margin-top:6px"><button class="br-x-share-btn" id="br-cal-x-btn">${xSvg()} ${streak}日連続をポスト</button></div>` : ''}
        </div>`;
    }

    function updateStats() {
      const wrap = document.getElementById('br-stats'); if (!wrap) return;
      const body = getBody();
      const total = body ? body.querySelectorAll('h2,h3').length : 0;
      const readCnt = ST.readSections.length;
      const pct = total ? Math.min(100, Math.round(readCnt/total*100)) : 0;
      wrap.innerHTML = `
        <div class="br-progress-box">
          <div class="br-progress-lbl">学習進捗</div>
          <div class="br-progress-track"><div class="br-progress-fill" style="width:${pct}%"></div></div>
          <div class="br-progress-pct">${pct}%</div>
        </div>
        <div class="br-stat-grid">
          <div class="br-stat-card"><div class="br-stat-lbl">既読</div><div class="br-stat-val">${readCnt}</div></div>
          <div class="br-stat-card"><div class="br-stat-lbl">全体</div><div class="br-stat-val">${total}</div></div>
          <div class="br-stat-card"><div class="br-stat-lbl">栞</div><div class="br-stat-val">${ST.bookmarks.length}</div></div>
          <div class="br-stat-card"><div class="br-stat-lbl">HL</div><div class="br-stat-val">${ST.highlights.length}</div></div>
        </div>
        <div class="br-sec-title">学習カレンダー</div>
        <div id="br-cal-host">${calendarHTML()}</div>
        <button class="br-btn ghost" id="br-reset-progress" style="margin-top:10px;"><span style="display:inline-flex;vertical-align:middle;margin-right:6px">${svg('refresh',13)}</span>進捗をリセット</button>
        <button class="br-btn danger" id="br-reset-all"><span style="display:inline-flex;vertical-align:middle;margin-right:6px">${svg('trash',13)}</span>全データ削除</button>
      `;
      bindCalendar();
      document.getElementById('br-reset-progress').addEventListener('click', () => {
        ST.readSections = []; ST.lastPosition = 0; saveSt();
        buildTOC(); updateStats(); toast('進捗をリセットしました');
      });
      document.getElementById('br-reset-all').addEventListener('click', () => {
        if (!confirm('全データ（栞・ハイライト・進捗・学習履歴）を削除します。よろしいですか？')) return;
        ST.bookmarks = []; ST.highlights = []; ST.readSections = []; ST.lastPosition = 0; ST.activityLog = {};
        saveSt();
        document.querySelectorAll('.br-highlight').forEach(s => {
          const p = s.parentNode;
          while (s.firstChild) p.insertBefore(s.firstChild, s);
          p.removeChild(s);
        });
        buildTOC(); renderBM(); renderHL(); updateStats();
        toast('全データを削除しました');
      });
    }

    function bindCalendar() {
      const prev = document.getElementById('br-cal-prev');
      const next = document.getElementById('br-cal-next');
      if (prev) prev.addEventListener('click', () => {
        if (--calendarView.month < 0) { calendarView.month = 11; calendarView.year--; }
        const host = document.getElementById('br-cal-host'); if (host) { host.innerHTML = calendarHTML(); bindCalendar(); }
      });
      if (next) next.addEventListener('click', () => {
        if (++calendarView.month > 11) { calendarView.month = 0; calendarView.year++; }
        const host = document.getElementById('br-cal-host'); if (host) { host.innerHTML = calendarHTML(); bindCalendar(); }
      });
      document.querySelectorAll('.br-cal-scope-btn').forEach(b => b.addEventListener('click', () => {
        calendarView.scope = b.dataset.scope;
        const host = document.getElementById('br-cal-host'); if (host) { host.innerHTML = calendarHTML(); bindCalendar(); }
      }));
      const xBtn = document.getElementById('br-cal-x-btn');
      if (xBtn) {
        xBtn.addEventListener('click', () => {
          const s = calcStreak();
          const log = loadGlobalActivity();
          const now = new Date();
          const mk = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
          let ms = 0;
          Object.keys(log).forEach(k => { if (k.startsWith(mk)) { const v = log[k]; ms += v?(typeof v==='number'?v:(v.sections||0)):0; } });
          shareOnX(`Brain学習 🔥 ${s}日連続中！今月${ms}セクション読了📚 #Brain学習 #継続は力なり`);
        });
      }
    }

    // ===== エクスポート =====
    document.getElementById('br-export').addEventListener('click', () => {
      if (!ST.highlights.length) { toast('ハイライトがありません', true); return; }
      const today = new Date().toLocaleDateString('ja-JP');
      let md = `# Brain学習ハイライトまとめ\n作成日: ${today}\n\n---\n\n`;
      ST.highlights.forEach((hl, i) => {
        md += `## ${i+1}. ${hl.section || '(セクション不明)'}\n> ${hl.text}\n\n`;
        if (hl.note) md += `📝 メモ: ${hl.note}\n\n`;
      });
      navigator.clipboard.writeText(md).then(
        () => toast('Markdownをコピーしました'),
        () => toast('コピーに失敗しました', true)
      );
    });

    // ===== 再開バナー =====
    function showResumeBanner() {
      if (ST.lastPosition <= 300) return;
      if (document.getElementById('br-resume')) return;
      const body = getBody();
      let title = '前回の位置';
      if (body) {
        const hs = body.querySelectorAll('h2,h3');
        let cur = null;
        for (const h of hs) { if (h.offsetTop <= ST.lastPosition) cur = h; else break; }
        if (cur) title = cur.innerText.substring(0, 40);
      }
      const bn = document.createElement('div');
      bn.id = 'br-resume';
      bn.innerHTML = `<span style="color:#ef4444;display:flex;align-items:center">${svg('book',18)}</span><div class="br-resume-body"><div class="br-resume-text">前回の続きから</div><div class="br-resume-title" title="${escapeHtml(title)}">${escapeHtml(title)}</div></div><button id="br-resume-go">${svg('play',11)}<span>再開</span></button><button id="br-resume-x" title="閉じる">${svg('x',12)}</button>`;
      document.body.appendChild(bn);
      bn.querySelector('#br-resume-go').addEventListener('click', () => {
        window.scrollTo({top: ST.lastPosition, behavior: 'smooth'});
        bn.remove();
      });
      bn.querySelector('#br-resume-x').addEventListener('click', () => bn.remove());
      setTimeout(() => bn.remove(), 8000);
    }

    // ===== スクロール処理（進捗・既読・位置保存） =====
    let scrollT = 0;
    let canSavePosition = false;
    let positionGateAt = 0;
    let lastTrackedScrollY = 0;
    function openPositionGate(delay) {
      const target = Date.now() + (delay || 2500);
      positionGateAt = target;
      canSavePosition = false;
      setTimeout(() => { if (Date.now() >= positionGateAt - 50) canSavePosition = true; }, delay || 2500);
    }
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollT < 600) return;
      scrollT = now;
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      const pct = sh > 0 ? Math.min(100, window.scrollY / sh * 100) : 0;
      pb.style.width = pct + '%';
      // 遷移直後のVue自動スクロール（scrollTop=0）で前回位置を上書きしないようガード
      // 時間ガード + 値しきい値の両方: scrollY > 100 の場合のみ保存
      if (canSavePosition && window.scrollY > 100) ST.lastPosition = window.scrollY;

      const body = getBody();
      let newReadCount = 0;
      if (body) {
        const threshold = window.innerHeight * 0.3;
        let changed = false;
        body.querySelectorAll('h2,h3').forEach(h => {
          const r = h.getBoundingClientRect();
          if (r.top < threshold && r.top > -r.height && h.id && !ST.readSections.includes(h.id)) {
            ST.readSections.push(h.id); changed = true; newReadCount++;
            const item = document.querySelector(`.br-toc-item[data-heading-id="${h.id}"]`);
            if (item) {
              item.classList.add('read');
              const ck = item.querySelector('.br-check'); if (ck) ck.innerHTML = svg('check',11);
            }
          }
        });
        if (changed) updateStats();
      }
      // 学習アクティビティ記録: 今日の日付に既読セクション数とスクロール距離を加算
      const scrollDelta = Math.max(0, window.scrollY - lastTrackedScrollY);
      lastTrackedScrollY = window.scrollY;
      if (canSavePosition && (newReadCount > 0 || scrollDelta > 0)) {
        recordActivity(newReadCount, scrollDelta);
      }
      syncTOCToScroll();
      saveSt();
    });

    // ===== 検索 =====
    document.getElementById('br-search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#br-toc-list .br-toc-item').forEach(it => {
        it.style.display = it.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    // ===== タブ切替 =====
    function activateTab(name) {
      panel.querySelectorAll('.br-tab').forEach(x => x.classList.remove('active'));
      panel.querySelectorAll('.br-section').forEach(x => x.classList.remove('active'));
      const tabBtn = panel.querySelector(`.br-tab[data-tab="${name}"]`);
      const sec = document.getElementById('br-s-' + name);
      if (tabBtn) tabBtn.classList.add('active');
      if (sec) sec.classList.add('active');
      if (name === 'stats') updateStats();
      if (name === 'bm') renderBM();
      if (name === 'hl') renderHL();
    }
    panel.querySelectorAll('.br-tab').forEach(t => {
      t.addEventListener('click', () => activateTab(t.dataset.tab));
    });

    // ===== パネル開閉 =====
    function setPanelOpen(open) {
      panel.classList.toggle('open', open);
      toggle.classList.toggle('br-hidden', open);
      const r = document.getElementById('br-resume');
      if (r) r.classList.toggle('br-hidden-by-panel', open);
    }
    toggle.addEventListener('click', () => {
      if (isTopPage()) { toast('記事ページで利用できます'); return; }
      setPanelOpen(!panel.classList.contains('open'));
    });
    document.getElementById('br-cls').addEventListener('click', () => setPanelOpen(false));
    document.getElementById('br-tut-restart').addEventListener('click', () => startTutorial());

    // ===== チュートリアル =====
    const TUT_KEY = 'brain_reader_tutorial_done_v1';
    const tutorial = document.createElement('div');
    tutorial.id = 'br-tutorial';
    tutorial.innerHTML = `
      <div id="br-tutorial-mask"></div>
      <div id="br-tutorial-spot"></div>
      <div id="br-tutorial-card">
        <div id="br-tutorial-step">STEP 1 / 6</div>
        <h4 id="br-tutorial-title">タイトル</h4>
        <div id="br-tutorial-body">本文</div>
        <div class="br-tut-btns">
          <button class="br-tut-skip" id="br-tut-skip">スキップ</button>
          <div class="br-tut-nav">
            <button class="br-tut-prev" id="br-tut-prev">戻る</button>
            <button class="br-tut-next" id="br-tut-next">次へ →</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(tutorial);

    const tutSteps = [
      {
        title: 'Brain Readerへようこそ',
        body: 'Brainの長大な記事をKindleのように快適に読むためのツールです。<br>主な機能は<b>目次・栞・ハイライト・進捗管理</b>。<br>30秒の簡単ツアーを始めます。',
        target: null, action: () => setPanelOpen(false)
      },
      {
        title: '右端のトグルボタン',
        body: '画面右端にブックアイコンのボタンがあります。クリックでサイドパネルが開閉します。',
        target: () => toggle, action: () => setPanelOpen(false)
      },
      {
        title: '目次タブ',
        body: '記事内のすべての見出しが一覧表示されます。<br>クリックでジャンプ、検索ボックスで絞り込み可能。<br>緑のチェックは既読、オレンジのドットは栞付き、赤い背景は現在位置。',
        target: () => panel.querySelector('.br-tab[data-tab="toc"]'),
        action: () => { setPanelOpen(true); activateTab('toc'); }
      },
      {
        title: '栞の付け方（ここが重要）',
        body: '本文の<b>見出し（h2/h3/h4）にマウスを乗せる</b>と、見出しの右隣にオレンジの<b>栞ボタン</b>が出現します。<br>クリックで栞ON/OFFをトグル。<div class="br-tip">栞タブで一覧確認・ジャンプ・削除ができます。</div>',
        target: () => panel.querySelector('.br-tab[data-tab="bm"]'),
        action: () => { setPanelOpen(true); activateTab('bm'); flashHeadingActions(); }
      },
      {
        title: 'ハイライト＆メモ',
        body: '本文を<b>3文字以上ドラッグ選択</b>すると、カラーパレットが現れます。<br>4色から選択、またはペンアイコンでメモ付き保存。<br><kbd>Alt</kbd>＋クリックで個別削除。',
        target: () => panel.querySelector('.br-tab[data-tab="hl"]'),
        action: () => { setPanelOpen(true); activateTab('hl'); }
      },
      {
        title: '進捗の確認・再開',
        body: 'スクロールすると見出しが自動で既読化されます。<br>統計タブで<b>進捗バー・学習カレンダー</b>を確認できます。<br>次回開いた時にトグルアイコンの横に「<b>続きから再開</b>」バナーが出ます。<div class="br-tip">困ったらヘッダーのヘルプアイコンでこのツアーを再表示できます。</div>',
        target: () => panel.querySelector('.br-tab[data-tab="stats"]'),
        action: () => { setPanelOpen(true); activateTab('stats'); }
      }
    ];

    let tutIdx = 0;
    function flashHeadingActions() {
      document.querySelectorAll('.br-heading-actions').forEach(el => {
        el.classList.add('br-show');
        setTimeout(() => el.classList.remove('br-show'), 6000);
      });
    }
    function positionTutorial() {
      const step = tutSteps[tutIdx];
      const card = document.getElementById('br-tutorial-card');
      const spot = document.getElementById('br-tutorial-spot');
      const tEl = step.target && step.target();
      if (tEl) {
        const r = tEl.getBoundingClientRect();
        spot.classList.add('show');
        spot.style.left = (r.left - 6) + 'px';
        spot.style.top = (r.top - 6) + 'px';
        spot.style.width = (r.width + 12) + 'px';
        spot.style.height = (r.height + 12) + 'px';
        const cardW = 360, cardH = card.offsetHeight || 200;
        let left = r.left - cardW - 20;
        let top = r.top;
        if (left < 16) left = r.right + 20;
        if (left + cardW > window.innerWidth - 16) left = Math.max(16, (window.innerWidth - cardW) / 2);
        if (top + cardH > window.innerHeight - 16) top = Math.max(16, window.innerHeight - cardH - 16);
        if (top < 16) top = 16;
        card.style.left = left + 'px';
        card.style.top = top + 'px';
      } else {
        spot.classList.remove('show');
        card.style.left = ((window.innerWidth - 360) / 2) + 'px';
        card.style.top = ((window.innerHeight - (card.offsetHeight || 200)) / 2) + 'px';
      }
    }
    function renderTutorial() {
      const step = tutSteps[tutIdx];
      document.getElementById('br-tutorial-step').textContent = `STEP ${tutIdx+1} / ${tutSteps.length}`;
      document.getElementById('br-tutorial-title').textContent = step.title;
      document.getElementById('br-tutorial-body').innerHTML = step.body;
      document.getElementById('br-tut-prev').style.visibility = tutIdx === 0 ? 'hidden' : 'visible';
      document.getElementById('br-tut-next').textContent = tutIdx === tutSteps.length - 1 ? '完了 ✓' : '次へ →';
      if (step.action) step.action();
      // パネルのスライドイン(300ms)完了後にスポットライト位置を計算
      setTimeout(positionTutorial, 50);
      setTimeout(positionTutorial, 350);
    }
    function startTutorial() {
      tutIdx = 0;
      tutorial.classList.add('show');
      renderTutorial();
    }
    function endTutorial() {
      tutorial.classList.remove('show');
      try { localStorage.setItem(TUT_KEY, '1'); } catch(e) {}
    }
    document.getElementById('br-tut-next').addEventListener('click', () => {
      if (tutIdx >= tutSteps.length - 1) {
        endTutorial();
        setPanelOpen(true);
        activateTab('toc');
        toast('ツアー完了。読書を始めましょう');
      }
      else { tutIdx++; renderTutorial(); }
    });
    document.getElementById('br-tut-prev').addEventListener('click', () => {
      if (tutIdx > 0) { tutIdx--; renderTutorial(); }
    });
    document.getElementById('br-tut-skip').addEventListener('click', endTutorial);
    window.addEventListener('resize', () => { if (tutorial.classList.contains('show')) positionTutorial(); });

    // ===== ユーティリティ =====
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // ===== ページモード切替・SPA遷移検知 =====
    function applyPageMode() {
      const top = isTopPage();
      toggle.style.display = '';
      toggle.classList.toggle('br-disabled', top);
      toggle.title = top ? '記事ページで利用できます' : '学習アシストを開く';
      if (top) {
        setPanelOpen(false);
        pb.style.display = 'none';
        hlPop.classList.remove('show');
        modal.classList.remove('show');
        tutorial.classList.remove('show');
        const r = document.getElementById('br-resume'); if (r) r.remove();
      } else {
        pb.style.display = '';
      }
    }

    let currentURL = location.href;
    let wasTop = isTopPage();
    function onRouteChange() {
      if (location.href === currentURL) return;
      currentURL = location.href;
      wasTop = isTopPage();
      resetAffiliateCache();
      // サイドバーと一時UIをリセット
      setPanelOpen(false);
      hlPop.classList.remove('show');
      modal.classList.remove('show');
      tutorial.classList.remove('show');
      const r = document.getElementById('br-resume'); if (r) r.remove();
      currentActiveId = null;
      // 新URLのストレージを読み直し
      SK = storageKey();
      ST = loadSt();
      pb.style.width = '0%';
      openPositionGate(2500);
      applyPageMode();
      // 即座にサイドバー一覧をクリア＆新記事のデータで再描画
      renderBM(); renderHL(); updateStats();
      const tocList = document.getElementById('br-toc-list'); if (tocList) tocList.innerHTML = '';
      if (!isTopPage()) {
        // Vueの再描画を待ってから段階的にTOC/HLを再構築（遅延ロード記事に対応）
        [300, 900, 2000, 3500].forEach(ms => setTimeout(() => {
          buildTOC(); addHeadingActions(); restoreHighlights();
        }, ms));
        setTimeout(() => {
          renderBM(); renderHL(); updateStats();
          showResumeBanner();
        }, 1200);
      } else {
        const list = document.getElementById('br-toc-list'); if (list) list.innerHTML = '';
      }
    }

    (function hookHistory() {
      const push = history.pushState, rep = history.replaceState;
      history.pushState = function() { const r = push.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
      history.replaceState = function() { const r = rep.apply(this, arguments); queueMicrotask(onRouteChange); return r; };
      window.addEventListener('popstate', onRouteChange);
      window.addEventListener('hashchange', onRouteChange);
    })();

    // URL変化のフォールバック検知（Brain側の実装がpushStateを経由しない場合に備えて）
    setInterval(() => {
      if (location.href !== currentURL) onRouteChange();
    }, 500);

    // ページ離脱時にサイドバーを閉じる
    window.addEventListener('pagehide', () => setPanelOpen(false));
    window.addEventListener('beforeunload', () => setPanelOpen(false));

    // ===== 初期化 =====
    function init() {
      applyPageMode();
      if (isTopPage()) return;
      openPositionGate(2500);
      buildTOC();
      renderBM();
      renderHL();
      addHeadingActions();
      restoreHighlights();
      updateStats();
      // 見出しの動的追加 & TOC件数変化を監視して自動再構築
      let lastHeadingCount = 0;
      setInterval(() => {
        if (isTopPage()) return;
        const body = getBody();
        if (!body) return;
        const n = body.querySelectorAll('h2,h3,h4').length;
        addHeadingActions();
        if (n !== lastHeadingCount) {
          lastHeadingCount = n;
          buildTOC();
          restoreHighlights();
          updateStats();
        }
      }, 2000);
      const tutDone = (() => { try { return localStorage.getItem(TUT_KEY) === '1'; } catch(e) { return false; } })();
      if (!tutDone) {
        setTimeout(startTutorial, 800);
      } else {
        setTimeout(showResumeBanner, 2000);
        setTimeout(showStreakCelebration, 3000);
      }
      toast('Brain Reader 起動');
    }
    setTimeout(init, 1000);
  })();