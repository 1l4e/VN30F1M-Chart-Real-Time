import "./App.css";
import { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ColorType, UTCTimestamp } from "lightweight-charts";
import type { CandlestickData } from "lightweight-charts";
import xulyData, { xulyDataSTwithATO } from "./utils/cals";
import strend, { strend2 } from "./utils/superTrend";
// @ts-ignore
import io from "socket.io-client";
import axios from "axios";

//let chart_url = "http://localhost:3007/socket.io";
let chart_url = "wss://dchart-socket.vndirect.com.vn/socket.io";

interface SockePrice {
  price: number;
  volume: number;
  symbol: string;
  time: number;
}
interface Item {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: number;
}

export async function fetchEntrade(date: number, dayTo?: number) {
  try {
    let history =
      import.meta.env.REAL_HISTPRY ||
      "https://services.entrade.com.vn/chart-api/chart";
    let cu = Math.floor(Date.now() / 1000);
    let nowd = cu;
    let yesterdayd = cu - 60 * 60 * 24 * (date ? date : 4);
    let now = nowd;
    let yesterday = yesterdayd;
    const re = 1;
    const res = await axios.get(
      `${history}?from=${yesterday}&resolution=${re}&symbol=VN30F1M&to=${now}`
    );
    return getChart(res.data,5);
  } catch (error) {
    console.log(error);
    return {};
  }
}
function RealtimeChart(): JSX.Element {
  const [day, setDay] = useState(14);
  const [dayTo, setDayTo] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [factor, setFactor] = useState(2);
  const [period, setPeriod] = useState(10);
  let item: CandlestickData;
  useEffect(() => {
    // Create a new chart instance
    const handleResize = () => {
      chartRef.current!.applyOptions({ width: chartContainerRef.current!.clientWidth});
      chartRef.current!.applyOptions({height: window!.innerHeight });
    };
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    const bot = async () => {
      chartRef.current = createChart(chartContainerRef.current!, {
        layout: {
          background: { type: ColorType.Solid, color: "rgba(20, 24, 35,1)" },
          textColor: "white",
        },
        width:  chartContainerRef.current?.clientWidth,
        height: window!.innerHeight,
        timeScale: {
          timeVisible: true,
        },
        grid: {
          vertLines: {
            color: "rgba(197, 203, 206, 0.1)",
          },
          horzLines: {
            color: "rgba(197, 203, 206, 0.1)",
          },
        },
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        localization: {
          locale: "vi-VN"
        }
      });
      const candles = chartRef.current.addCandlestickSeries({
        upColor: "#089981",
        downColor: "#f23645",
      });
      let start = timeCurrent() + 300;
      // Create a new line series on the chart
      const series = chartRef.current.addLineSeries({
        lineWidth: 1
      });
      let gaga = await fetchEntrade(day, dayTo);
      let data = xulyData(gaga);
      let st: any = strend(xulyDataSTwithATO(gaga), period, factor);
      candles.setData(data);
      series.setData(st);
      let markers:any[] = [];
      st.forEach((e:any,i:number) => {
        if(i>1){
          if (e.trend === 'long' && e.trend!= st[i-1].trend){
            markers.push({
              time:e.time,
              position: 'belowBar',
              color: '#59ac59',
              text: 'L',
              shape: 'arrowUp',
            });
          }
          else if(e.trend === 'short' && e.trend != st[i-1].trend){
            markers.push({
              time:e.time,
              position: 'aboveBar',
              color: '#e91e63',
              text: 'S',
              shape: 'arrowDown'
            });
          }
        }
        
      });
      series.setMarkers(markers)
      const socket = io(chart_url, {
        query: {
          symbol: "VN30F1M",
        },
      });
      socket.on("connection", (socket: any) => {
        console.log("connection", socket.id); // x8WIv7-mJelg7on_ALbx
      });

      // client-side
      socket.on("connect", () => {
        console.log("connect", socket.id); // x8WIv7-mJelg7on_ALbx
        socket.emit("addsymbol", "VN30F1M");
      });

      socket.on("disconnect", () => {
        console.log("disconnect", socket.id); // undefined
      });
      socket.on("connect_error", (err: any) => {
        console.log(`connect_error due to ${err.message}`);
      });
      socket.on("price", (socket: SockePrice) => {
        //console.log(socket.price);
        let tt = socket.time / 1000;
        //console.log(tt - start);
        if (tt >= start) {
          //console.log(1)
          if (start == data[data.length - 1].time - 7 * 3600) {
            item = data[data.length - 1];
          } else {
            item = {
              open: socket.price,
              close: socket.price,
              high: socket.price,
              low: socket.price,
              time: (start + 7 * 3600) as UTCTimestamp,
            };
          }
          start = start + 5 * 60;
        } else {
          //console.log(2)
          if (!item.open) {
            item = {
              open: socket.price,
              close: socket.price,
              high: socket.price,
              low: socket.price,
              time: (start + 7 * 3600) as UTCTimestamp,
            };
          } else {
            //console.log(3);
            item.high = Math.max(item.high, socket.price);
            item.low = Math.min(item.low, socket.price);
            item.close = socket.price;
          }
        }

        candles.update(item);
        if (item.time != data[data.length - 1].time) {
          data.push(item);
        } else {
          data[data.length - 1] = item;
        }
        st = strend2(data, period, factor);
        //console.log(st[st.length-1],item.time)
        series.update(st[st.length - 1]);


      });
    };
    bot();
     window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chartRef.current!.remove();
    };
  }, []);

  function handleEvent() {}

  return (
    <>
      <div ref={chartContainerRef} className="min-h-screen"/>
    </>
  );
}

export default RealtimeChart;


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

async function getChart(res:any,resolution:number) {
  let t:any[]=[];
  let o:any[]=[];
  let h:any[]=[];
  let l:any[]=[];
  let c:any[]=[];
  let v:any[]=[];
  let data = [];
  let offset = (resolution - (new Date(res.t[0]*1000).getMinutes() %resolution));
  for (let j = 0;j< res.t.length-offset;j++){
      let i = j+offset;
      let currTime = new Date(res.t[i]*1000);

      if (isATO(currTime).onTime || isATC(currTime).onTime || is11h30(currTime).onTime){
          data.push({
              time : currTime.getTime(),
              open : res.o[i],
              high : res.h[i],
              low : res.l[i],
              close : res.c[i],
              volume : res.v[i],
          })
      }
      else{
          if (currTime.getMinutes() % resolution === 0){
              data.push({
                time : currTime.getTime(),
                open : res.o[i],
                high : res.h[i],
                low : res.l[i],
                close : res.c[i],
                volume : res.v[i],
              })
          }
          else{
              let ll = data.length -1
              if (data[ll]) {
                  data[ll].high = Math.max( data[ll].high, res.h[i]);
                  data[ll].low = Math.min( data[ll].low, res.l[i]);
                  data[ll].close = res.c[i];
                  data[ll].volume += res.v[i];
              }
             
          }
      }
  }



  data.forEach((item:any)=> {
      let tt = new Date(item.time).getTime()
     t.push(tt/1000);
     o.push(item.open);
     h.push(item.high);
     l.push(item.low);
     c.push(item.close);
     v.push(item.volume)
  })
  return {t,o,h,l,c,v}
}




function is11h30(time:Date){
  let gio = time.getHours();
  let phut = time.getMinutes();
  if (gio ===11 && phut ==30){
      return {onTime:true}
  }
  return {onTime:false,conLai:0}
}


function isATO(time:Date){
  let gio = time.getHours();
  let phut = time.getMinutes();
  if (gio ===14 && phut ===45){
      return {onTime:true}
  }
  return {onTime:false}
}

function isATC(time:Date){
  let gio = time.getHours();
  let phut = time.getMinutes();
  if (gio ===14 && phut ===30){
      return {onTime:true}
  }
  return {onTime:false}
}