// 每日一言名言数组
const quotes = [
  "生活不是等待暴风雨过去，而是要学会在雨中跳舞。",
  "成功不是终点，失败不是致命的，继续前进的勇气才是最重要的。",
  "不要因为走得太远，而忘记了为什么出发。",
  "今天的努力，是为了明天的选择权。",
  "世界上最快乐的事，莫过于为理想而奋斗。",
  "路虽远行则将至，事虽难做则必成。",
  "山不过来，我就过去。",
  "星光不问赶路人，时光不负有心人。",
  "愿你历尽千帆，归来仍是少年。",
  "纸上得来终觉浅，绝知此事要躬行。",
  "落红不是无情物，化作春泥更护花。",
  "海内存知己，天涯若比邻。",
  "长风破浪会有时，直挂云帆济沧海。",
  "山重水复疑无路，柳暗花明又一村。",
  "宝剑锋从磨砺出，梅花香自苦寒来。",
  "千里之行，始于足下。",
  "学而时习之，不亦说乎？",
  "知之者不如好之者，好之者不如乐之者。",
  "己所不欲，勿施于人。",
  "温故而知新，可以为师矣。",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Life is what happens to you while you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "The only impossible journey is the one you never begin."
];

// 获取随机名言
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 查找公告内容元素
  const announcementContent = document.querySelector('.announcement_content');
  
  if (announcementContent) {
    // 设置随机名言
    announcementContent.textContent = getRandomQuote();
    
    // 添加一个小图标
    announcementContent.innerHTML = '<i class="fas fa-quote-left" style="margin-right: 8px; color: #49b1f5;"></i>' + announcementContent.textContent;
  }
});