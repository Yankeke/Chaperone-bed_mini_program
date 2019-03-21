const domain = "https://phc.laiqubao.com/index.php/Home";
const interfaces = {
  //  获取openid，返回openid
  getopenid: domain + "/index/openid",
  //  https://phc.laiqubao.com/index.php/Home/index/openid
  getuserinfo:domain + "/index/user",
  //  https://phc.laiqubao.com/index.php/Home/index/user
  getcode: domain + "/Api/duanxin",
  //  https://phc.laiqubao.com/index.php/Home/Api/duanxin
  //  提交手机号码和openid
  tijiao: domain + "/Api/tijiao",
  //  https://phc.laiqubao.com/index.php/Home/Api/tijiao
  //  获取押金数量
  getyajin: domain + "/Api/money?type=yajin",
  //  https://phc.laiqubao.com/index.php/Home/Api/money?type=yajin
  //  租借记录
  rentrec: domain + "/index/rent_record",
  //  https://phc.laiqubao.com/index.php/Home/index/rent_record
  //  充值记录
  payrec: domain +"/index/recharge_record",
  // https://phc.laiqubao.com/index.php/Home/index/recharge_record
  //  预充值押金
  yuyajin: domain + "/Api/money?type=yajin",
  //  https://phc.laiqubao.com/index.php/Home/Api/money?type=yajin
  //  预充值余额
  yuyue: domain + "/Api/money?type=yue",
  //  https://phc.laiqubao.com/index.php/Home/Api/money?type=yue
  //  充值
  pay: domain +"/Api/pay",
  //  https://phc.laiqubao.com/index.php/Home/Api/pay
  //  押金提现
  yajinti: domain +"/api/yajinti",
  //  https://phc.laiqubao.com/index.php/Home/api/yajinti
  //  确定提现押金
  yajinrefund: domain +"/api/yajinrefund",
  //  https://phc.laiqubao.com/index.php/Home/api/yajinrefund
  //  余额提现
  yueti: domain +"/api/yueti",
  //  https://phc.laiqubao.com/index.php/Home/api/yueti
  //  确定提现余额
  yuerefund: domain +"/Api/yuerefund",
  //  https://phc.laiqubao.com/index.php/Home/Api/yuerefund
  //  扫码到结果页登录
  denglu: domain +"/Api/denglu",
  //  https://phc.laiqubao.com/index.php/Home/Api/denglu
  open: domain +"/Api/apiopen",
  //  https://phc.laiqubao.com/index.php/Home/Api/apiopen
  //  开门结果
  getstatus: domain +"/Api/wanle",
  //  https://phc.laiqubao.com/index.php/Home/Api/wanle
  //  管理员登录
  guanli: domain +"/index/guanli",
  //  https://phc.laiqubao.com/index.php/Home/index/guanli
  //  管理员页面 当前陪护床地址信息
  getinfo: domain +"/index/sbdizhi",
  //  https://phc.laiqubao.com/index.php/Home/index/sbdizhi
  //  管理员直接开门
  glopen: domain + "/Api/glopen",
  //  https://phc.laiqubao.com/index.php/Home/Api/glopen
  //  管理员修改床柜地址
  xgdizhi: domain +"/index/xgdizhi",
  //  https://phc.laiqubao.com/index.php/Home/index/xgdizhi
}

module.exports = interfaces;