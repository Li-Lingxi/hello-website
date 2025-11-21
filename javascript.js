document.addEventListener("DOMContentLoaded", function() {

  const body = document.body;
/* ------------------ 初始选择窗口 ------------------*/
  const modal = document.getElementById('selection-modal');
  const cardsContainer = document.getElementById('cardItems');

/* ------------------ 卡片信息生成 ------------------*/
  //随机码生成函数
  function generateBookingNum() {
  // 前缀 RB-
  const prefix = "RB-";
  // 生成随机部分（长度固定为 10 个字符，最终总长 14）
  const randomPart = Math.random().toString(36).substring(2, 12).toUpperCase();
  return "#" + prefix + randomPart;
  }

  // 日期获取与计算
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  const tomorrow = new Date(today);
  const yesterDay = new Date(today);
  const dayBeforeYesterDay = new Date(today);
  const fourDaysAgo = new Date(today)

  fourDaysAgo.setDate(today.getDate()-4);
  dayAfterTomorrow.setDate(today.getDate()+2);
  dayBeforeYesterDay.setDate(today.getDate()-2);
  tomorrow.setDate(today.getDate()+1);
  yesterDay.setDate(today.getDate()-1);

  //日期处理函数
  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  }

  //生成卡片函数
  function generateCard(sport, date, showExtra = false) {
    let title = "标题缺失";
    let place = "地点缺失";
    let timeRange = "时间缺失";
    let cardHTML = "内容缺失";
    let num = generateBookingNum() + " 运动时 ¥5";
    if (sport === "gym") {
      title = "南校园新体育馆健身房";
      place = "南校园新体育馆健身房-场地1";
      timeRange = "18:00 - 20:00";
    }else if (sport === "swim") {
      title = "南校园游泳池";
      place = "南校园游泳池-场地1";
      timeRange = "19:30 - 21:00";
    }
    return cardHTML = `
    <div data-v-578881b0="" class="card-item">
      <div data-v-578881b0="" class="card-icon">
        <i data-v-578881b0="" aria-hidden="true" class="v-icon notranslate mdi mdi-alert-circle-outline theme--light"></i>
      </div>
      <div data-v-578881b0="" class="card-content">
        <div data-v-578881b0="" class="card-header">
          <div data-v-578881b0="" class="booking-title">${title}</div>
          <hr data-v-578881b0="" role="separator" aria-orientation="horizontal" class="v-divider theme--light">
          <div data-v-578881b0="" class="booking-id text-caption mt-2">${num}</div>
        </div>
        <div data-v-578881b0="" class="card-details text-body-2">
          <div data-v-578881b0="">
            <i data-v-578881b0="" aria-hidden="true" class="v-icon notranslate mr-2 mdi mdi-calendar theme--light" style="font-size: 16px;"></i>${formatDate(date)}
            <i data-v-578881b0="" aria-hidden="true" class="v-icon notranslate ml-2 mr-1 mdi mdi-clock-outline theme--light" style="font-size: 16px;"></i>${timeRange}
            <i data-v-578881b0="" aria-hidden="true" class="v-icon notranslate ml-2 mr-1 mdi mdi-map-marker theme--light" style="font-size: 16px;"></i>${place}
          </div>
        </div>
        ${showExtra ? 
          `<div data-v-578881b0="" class="card-actions">
            <button data-v-578881b0="" type="button" class="action-button v-btn v-btn--outlined theme--light v-size--small error--text">
              <span class="v-btn__content"> 取消 </span>
            </button>
          </div>` : ''
        }
      </div>
      <div data-v-578881b0="" class="card-info">
        <span data-v-578881b0="" class="v-chip v-chip--outlined theme--light v-size--small green green--text">
          <span class="v-chip__content"> 已预约 </span>
        </span>
      </div>
    </div>`;
  }

  //根据点击的按钮生成卡片并排列顺序
    document.getElementById('gym').onclick = () => {
      modal.classList.add('hidden');
      const cardA = generateCard('gym', dayAfterTomorrow, true);
      const cardB = generateCard('gym', today, false);
      const cardC = generateCard('gym', dayBeforeYesterDay, false);
      const cardD = generateCard('gym', fourDaysAgo, false);
      cardsContainer.innerHTML = cardA + cardB + cardC + cardD;
    };
    document.getElementById('swim').onclick = () => {
      modal.classList.add('hidden');
      const cardA = generateCard('gym', tomorrow, true);
      const cardB = generateCard('swim', today, false);
      const cardC = generateCard('gym', yesterDay, false);
      const cardD = generateCard('swim', dayBeforeYesterDay, false);
      cardsContainer.innerHTML = cardA + cardB + cardC + cardD;
    };
  
/* ------------------ 卡片详情弹窗触发 ------------------*/

  const cardList = document.getElementById('card-list');
  const dialog = document.getElementById('booking-dialog');
  const content = document.getElementById('dialog-content');
  const confirmBtn = document.getElementById('confirm-btn');
  // 显示弹窗
  function openDialog() {
      dialog.classList.add('dialog-open');
      // 锁定页面滚动
      document.documentElement.classList.add('dialog-open-no-scroll');
  }
  // 关闭弹窗
  function closeDialog() {
      dialog.classList.remove('dialog-open');
      // 移除锁定页面滚动
      document.documentElement.classList.remove('dialog-open-no-scroll');
  }

  // 给每张卡片添加点击事件
  cardList.addEventListener('click', function(event) {
    const clickedButton = event.target.closest('.card-item');
    if (clickedButton) {
        const card = clickedButton.closest('.card-item');
        // 获取卡片信息
        const venue = card.querySelector('.booking-title')?.innerText || '未知场馆';
        const idText = card.querySelector('.booking-id')?.innerText || '无编号';
        const num = idText.substring(0, 14);


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
          <div class="mb-2">预约编号： ${num}</div>
          <div class="mb-2">费用：${fee}</div>
        `;

        // 显示弹窗
        openDialog();
    }
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
