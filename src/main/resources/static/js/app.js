// 共通ユーティリティ
const toAbsoluteUrl = (u) => new URL(u, window.location.origin).href;

// モードレスウィンドウを開いてサーバ連携
function modelessWindow() {
  // ① ユーザー操作直後に window.open
  const target = '_testList';
  const modal = window.open('about:blank', target, 'width=1280,height=1080');

  // ② Ajax用リクエスト
  const requestBody = toData('name', 'sex');

  // ルート相対URLに統一（/test1）
  ajaxPost(
    '/test1',
    requestBody, function (response) {
      // ③ 別ウィンドウへ POST するパラメータ
      const param = {
        testList: JSON.stringify(response),
      };
      // POST 先もルート相対に統一（/test2）
      post('/test2', param, target);
    },
    function () {
      modal.close();
      alert('エラー');
    }
  );
}

// シンプルなデータ収集（idで指定した要素から値を収集）
function toData(...name) {
  let data = {};
  for (let id of name) {
    const el = document.getElementById(id);
    data[id] = el ? el.value : '';
  }
  return data;
}

// JSON POST (fetch)
function ajaxPost(url, data, onSuccess, onError) {
  const abs = toAbsoluteUrl(url);
  fetch(abs, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP error');
      return res.json();
    })
    .then(onSuccess)
    .catch((err) => {
      if (onError) onError(err);
    });
}

// 別ウィンドウ（ターゲット）へフォームPOST
function post(action, param, target) {
  const form = document.createElement('form');
  form.method = 'post';
  // 相対でも絶対URLに正規化してから設定
  form.action = toAbsoluteUrl(action);
  form.target = target;

  Object.keys(param).forEach(function (key) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = param[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
