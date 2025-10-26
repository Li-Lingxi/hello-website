document.addEventListener("DOMContentLoaded", function() {
  function generateBookingId() {
  // 前缀 RB-
  const prefix = "RB-";
  // 生成随机部分（长度固定为 11 个字符，最终总长 14）
  const randomPart = Math.random().toString(36).substring(2, 12).toUpperCase();
  return "#" + prefix + randomPart;
}

  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  document.getElementById('booking1').innerText = generateBookingId() + ' 运动时 ¥5';
  document.getElementById('booking2').innerText = generateBookingId() + ' 运动时 ¥5';
  document.getElementById('booking3').innerText = generateBookingId() + ' 运动时 ¥5';

  // 自动获取今天日期
  const today = new Date();
  const tomorrow = new Date(today);
  const yesterday = new Date(today);
  tomorrow.setDate(today.getDate()+2);
  yesterday.setDate(today.getDate()-2);
  document.getElementById('date1').innerText = formatDate(tomorrow);
  document.getElementById('date2').innerText = formatDate(today);
  document.getElementById('date3').innerText = formatDate(yesterday);

  const cards = document.querySelectorAll('.card-item');
  const dialog = document.getElementById('booking-dialog');
  const content = document.getElementById('dialog-content');
  const confirmBtn = document.getElementById('confirm-btn');
  // 显示弹窗
  function openDialog() {
      dialog.classList.add('dialog-open');
  }
  // 关闭弹窗
  function closeDialog() {
      // Vue 的过渡效果是在动画结束后才移除元素。
      // 这里我们延迟移除类，让关闭动画播放完毕。
      dialog.classList.remove('dialog-open');
  }
  // 给每张卡片添加点击事件
  cards.forEach(card => {
    card.addEventListener('click', function() {
      // 获取卡片信息
      const venue = card.querySelector('.booking-title')?.innerText || '未知场馆';
      const idText = card.querySelector('.booking-id')?.innerText || '无编号';
      const id = idText.substring(0, 14);


      const detailsText = card.querySelector('.card-details')?.innerText || '';
      
      // 尝试解析日期、时间、地点
      const dateMatch = detailsText.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
      const timeMatch = detailsText.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);
      const placeMatch = detailsText.match(/([^\s]+场地\d+)/);

      const date = dateMatch ? dateMatch[1] : '未知日期';
      const time = timeMatch ? timeMatch[1] : '未知时段';
      const place = placeMatch ? placeMatch[1] : '未知场地';
      const fee = idText.match(/运动时\s*¥?\d*/) ? idText.match(/运动时\s*¥?\d*/)[0] : '未知费用';

      // 生成详细内容
      content.innerHTML = `
        <div class="mb-2">场馆： ${venue}</div>
        <div class="mb-2">预约日期： ${date}</div>
        <div class="mb-2">预约时段： ${time}</div>
        <div class="mb-2">场地名称： ${place}</div>
        <div class="mb-2">预约编号： ${id}</div>
        <div class="mb-2">费用：${fee}</div>
      `;

      // 显示弹窗
      openDialog();
    });
  });

  // 点击确认关闭弹窗
  confirmBtn.addEventListener('click', closeDialog);

  // 点击灰色背景关闭弹窗
  dialog.addEventListener('click', function(e) {
    if (e.target === dialog) {
        closeDialog();
    }
  });
});
