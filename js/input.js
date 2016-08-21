window.addEventListener('DOMContentLoaded',
  function() {
    // ページ本体が読み込まれたタイミングで実行するコード
    var o_x = 0, o_y = 0, flag = false;
    var subject = document.querySelector('#subject');
    var memo = document.querySelector('#memo');
    var save = document.querySelector('#save');
    var cancel = document.querySelector('#cancel');

    if (HTMLCanvasElement) {
      // Canvas APIを利用した処理
      var board = document.querySelector('#board');
      var c = board.getContext('2d');
      c.strokeStyle = '#00f';
      c.lineWidth = 3;
    } else {
      window.alert('Canvas対応のブラウザでアクセスしてください。');
      return;
    }

    save.addEventListener('click',
      function(e) {
        // ［保存］ボタンのクリック時に実行するコード
        e.preventDefault();
        if (subject.validity.valid === false ||
            memo.validity.valid === false) {
          // 件名、メモが入力されていない時に実行するコード
          window.alert('件名、メモはいずれも必須です。');
          return;
        }
        if (localStorage) {
          // セッションストレージから現在位置を取得するコード
          var cpos_latitude = sessionStorage.getItem('cpos_latitude');
          var cpos_longitude = sessionStorage.getItem('cpos_longitude');
          if (cpos_latitude === null || cpos_longitude === null) {
            window.alert('トップページからアクセスし直してください。');
            location.href = 'index.html';
          }
          // ローカルストレージにメモ情報を登録するコード
          var list = localStorage.getItem('memolist');
          if (list === null) {
            list = [];
          } else {
            list = JSON.parse(list);
          }
          list.push({
            // ローカルストレージに保存する内容
            latitude: cpos_latitude,
            longitude: cpos_longitude,
            subject: subject.value,
            memo: memo.value,
            picture: board.toDataURL(),
            updated: new Date()
          });
          list = JSON.stringify(list);
          localStorage.setItem('memolist', list);
          location.href = 'index.html';
        }
      }, false
    );

    cancel.addEventListener('click',
      function() {
        // ［キャンセル］ボタンのクリック時に実行するコード
        location.href = 'index.html';
      }, false
    );

    var ondown = function(e) { 
      // タッチ開始／マウスダウン時の処理
      e.preventDefault();
      flag = true;
      if (e.touches) { e = e.touches[0]; }
      var c_rect = e.target.getBoundingClientRect();
      o_x = e.clientX - c_rect.left;
      o_y = e.clientY - c_rect.top;
    };

    var onup = function(e) {
      // タッチ終了／マウスアップ時の処理
      e.preventDefault();
      flag = false;
    };

    var onmove = function(e) {
      // タッチ移動中／マウス移動中の処理
      e.preventDefault();
      if (flag) {
        // マウスが押されている場合の描画処理
        if (e.touches) { e = e.touches[0]; }
        var c_rect = e.target.getBoundingClientRect();
        var x = e.clientX - c_rect.left;
        var y = e.clientY - c_rect.top;
        c.beginPath();
        c.moveTo(o_x, o_y);
        c.lineTo(x, y);
        c.stroke();
        o_x = x;
        o_y = y;
      }
    };

    if (window.ontouchstart === undefined) {
      // タッチイベントに対応していない場合の処理
      board.addEventListener('mousedown', ondown, false);
      board.addEventListener('mouseup',   onup,   false);
      board.addEventListener('mousemove', onmove, false);
    } else {
      // タッチイベントに対応している場合の処理
      board.addEventListener('touchstart',ondown, false);
      board.addEventListener('touchend',  onup,   false);
      board.addEventListener('touchmove', onmove, false);
    }
  }, false
);
