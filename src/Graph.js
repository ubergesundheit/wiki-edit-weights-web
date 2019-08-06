import React from "react";
import ReactEcharts from "echarts-for-react";

import useWebsocket from "./useWebsocket";

import YAxisProvider from "./YAxisContext";

const formatDate = d =>
  ["getHours", "getMinutes", "getSeconds"]
    .map(fnName =>
      d[fnName]()
        .toString()
        .padStart(2, "0")
    )
    .join(":");

const Graph = ({ websocketUrl, title, subtitle }) => {
  const { max } = React.useContext(YAxisProvider);
  const { messages: data, error } = useWebsocket(websocketUrl);

  const [xAxisData, seriesData] = React.useMemo(
    () =>
      data.reduce(
        (prev, curr) => {
          // date -> xAxisData
          prev[0].push(formatDate(new Date(curr.interval)));

          // change_size -> seriesData
          prev[1].push(curr.change_size);

          return prev;
        },
        [[], []]
      ),
    [data]
  );

  const echartsOptions = React.useMemo(() => {
    return {
      title: {
        text: title,
        subtext: subtitle
      },
      tooltip: {
        trigger: "axis"
      },
      toolbox: {
        show: false
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: xAxisData
      },
      yAxis: {
        type: "value",
        min: 0,
        max: Math.ceil(max * 1.2)
      },
      series: [
        {
          type: "bar",
          data: seriesData
        }
      ]
    };
  }, [seriesData, subtitle, title, xAxisData, max]);

  if (error !== null) {
    return (
      <p>
        Error connecting to Websocket {websocketUrl}.<br />
        <strong>
          Sometimes Adblockers interfere with the Websocket connection.
        </strong>{" "}
      </p>
    );
  }

  return (
    <ReactEcharts option={echartsOptions} notMerge={true} lazyUpdate={true} />
  );
};

export default Graph;
