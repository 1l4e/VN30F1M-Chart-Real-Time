function xulyData(g: any) {
    // xử lý data từ entrade thành data dùng cho chart
    let arr: any = [];
    g.t.forEach((e: any, i: number) => {
      let item = {
        //chuyển sang GMT+7
       /*  time: parseFloat(g.t[i]) + 7 * 3600, */
       time: parseFloat(g.t[i]) +7*3600,
        open: parseFloat(g.o[i]),
        high: parseFloat(g.h[i]),
        low: parseFloat(g.l[i]),
        close: parseFloat(g.c[i]),
        volume: g.v[i],
      };
      if(isATC(g.t[i])){
        if (!isNaN(g.t[i+1]))
          {
            item.close = parseFloat(g.o[i+1]);
            item.high = (item.open -item.close)>0 ? item.open:item.close
            item.low = (item.open -item.close) >0 ? item.close: item.open
       }
      }
      if(isATO(g.t[i])){
        if (!isNaN(g.t[i+1]))
          {
            item.close = parseFloat(g.o[i+1]);
            item.high = (item.open -item.close)>0 ? item.open:item.close
            item.low = (item.open -item.close) >0 ? item.close: item.open
       }
      }
      if (!is11h30(g.t[i])){
        arr.push(item);
      }
      
    });
    return arr;
  }
  export function xulyDataST(g: any) {
    //xử lý data từ entrade thành data sử dụng cho supertrend
    let arr: any = [];
    g.t.forEach((e: any, i: number) => {
      let item = [
        parseFloat(g.t[i])+7*3600,
        parseFloat(g.o[i]),
        parseFloat(g.h[i]),
        parseFloat(g.l[i]),
        parseFloat(g.c[i]),
        g.v[i],
      ];
      arr.push(item);
    });
    return arr;
  }
  export function timeStamp(time: number) {
    const date = new Date(time);
    let dateFormat =
      date.getDate() +
      "-" +
      date.getMonth() +
      1 +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    return dateFormat;
  }
  
  export function timeRemain() {
    //Thời gian còn lại tới 5 phút tiếp theo
    let time = new Date(Date.now());
    let gio = time.getHours();
    let phut = time.getMinutes();
    let giay = time.getSeconds();
    let phutd = 5 - (phut % 5);
    let t = (phutd * 60 - giay) * 1000;
    return t;
  }
  export function timeCurrent(t?: number) {
    if (!t) t = 5;
    // thời gian 5 phút hiện tại
    let time = new Date(Date.now());
    let phut = time.getMinutes();
    let phutd = phut % t == 0 ? phut : phut - (phut % t);
    let tC = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      time.getHours(),
      phutd
    );
    let tS = tC.getTime() / 1000;
    //- 5 phút vì current time phải tính từ 10 phút gần nhất
    return tS - 300;
  }
  function isATO(time:number){
    const date = new Date(time *1000);
    const hours = date.getHours();
    const min = date.getMinutes();
    if (hours === 14 && min === 45) {
      return true
    }
    else{
      return false;
    }
    }
    
  function isATC(time:number){
    const date = new Date(time *1000);
    const hours = date.getHours();
    const min = date.getMinutes();
    if (hours === 14 && min === 30) {
      return true
    }
    else{
      return false;
    }
  }
  
  function is11h30(time:number) {
    const date = new Date(time *1000);
    const hours = date.getHours();
    const min = date.getMinutes();
    if (hours === 11 && min === 30) {
      return true
    }
    else{
      return false;
    }
  }
  
  
  export function xulyDataSTwithATO(g:any){
    let arr: any = [];
    g.t.forEach((e: any, i: number) => {
      let item = [
        /* parseFloat(g.t[i]) + 7 * 3600, */
        parseFloat(g.t[i]) +7*3600,
        parseFloat(g.o[i]),
        parseFloat(g.h[i]),
        parseFloat(g.l[i]),
        parseFloat(g.c[i]),
        g.v[i],
      ];
      if (isATC(g.t[i])){
        if (!isNaN(g.t[i+1]))
          {item[4] = parseFloat(g.o[i+1]);
          item[2] = (item[1]-item[4]>0)? item[1]: item[4]
          item[3] = (item[1]-item[4]>0)? item[4]: item[1]
          //  console.log("ATC",item)
          }
      }
  
      if(isATO(g.t[i])){
        if (!isNaN(g.t[i+1]))
          {item[4] = parseFloat(g.o[i+1]);
            item[2] = (item[1]-item[4]>0)? item[1]: item[4]
            item[3] = (item[1]-item[4]>0)? item[4]: item[1]
           // console.log("ATO",item)
          }
      }
      if (!is11h30(g.t[i])){
        arr.push(item);
      }
      
    });
    //console.log(arr)
    return arr;
  }
  
  export function tinhgio(ms: number) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return d + " ngày" + h + "h:" + m + "p:" + s + "s";
  }
  
  type gioLamViec = {
    onTime : boolean,
    conLai  : number,
  }
  
  export function ngoaiGioLamViec() {
    let data;
    let conlai = 0;
    let time = new Date(Date.now());
    let date = time.getDay();
    let gio = time.getHours();
    let phut = time.getMinutes();
    let giay = time.getSeconds();
    console.log(date)
    let start = 9
    if (date == 6 || date ==0) {
      (date == 0) && (date = 7)
      conlai =
        (7 - date) * 24 * 60 * 60 * 1000 +
        ((24 - gio + start-1) * 60 + (59 - phut)) * 60000 +
        (60 - giay) * 1000;
      // return
      data = {onTime : false, conLai: conlai};
    } else {
      if (
        gio < start ||
        (gio == start+2 && phut >= 30) ||
        (gio > start+2 && gio < start+4) ||
        (gio == start+5 && phut > 44) ||
        gio > start+5
      ) {
        if (0 <= gio && gio < start) {
          conlai = (((start-1) - gio) * 60 + (59 - phut)) * 60000 + (60 - giay) * 1000;
          console.log("1");
        } else if (gio == start+2 && phut >= 30) {
          conlai = (1 * 60 + (59 - phut)) * 60000 + (60 - giay) * 1000;
          console.log("2");
        } else if (gio > start+2 && gio < start+4) {
          conlai = ((start+3 - gio) * 60 + (59 - phut)) * 60000 + (60 - giay) * 1000;
          console.log("5");
        } else if (gio == start+5 && phut >= 30) {
          conlai = ((24 - start+5 + start) * 60 - phut) * 60000 - giay * 1000;
          console.log("3");
        } else if (gio > 14) {
          conlai = ((24 - gio + start) * 60 - phut) * 60000 - giay * 1000;
          console.log("4");
        }
        if (conlai == 0) conlai = 3000;
        data= {onTime : false, conLai: conlai};
      }
      else {
        data= {onTime : true, conLai: conlai};
      }
    }
    return data;
  }
  
  export default xulyData;
  