import React, { useEffect, useCallback, useState } from "react";
//-----------------------------------------------
import Button from "react-bootstrap/Button";
//-----------------------------------------------
import { HiRefresh } from "react-icons/hi";
import {
  PieChart,
  Pie,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
//-----------------------------------------------
import { apiUrl } from "../contexts/constants";
import axios from "axios";

const Dashboard = () => {
  const [dbinfo, setDbinfo] = useState({
    infodb: {
      collections: "",
      objects: "",
      avgObjSize: "",
      storageSize: "",
      totalFreeStorageSize: "",
    },
  });

  const [svinfo, setSvinfo] = useState({
    infosv: {
      totalmem: "",
      freemem: "",
      cpuUsage: "",
      cpuFree: "",
    },
  });

  const [PostsHot, setPostHot] = useState([]);

  // db
  const [activeIndexDB, setActiveIndexDB] = useState(0);
  const onPieEnterDB = useCallback(
    (_, index) => {
      setActiveIndexDB(index);
    },
    [setActiveIndexDB]
  );

  // ram
  const [activeIndexRAM, setActiveIndexRAM] = useState(0);
  const onPieEnterRAM = useCallback(
    (_, index) => {
      setActiveIndexRAM(index);
    },
    [setActiveIndexRAM]
  );

  // cpu
  const [activeIndexCPU, setActiveIndexCPU] = useState(0);
  const onPieEnterCPU = useCallback(
    (_, index) => {
      setActiveIndexCPU(index);
    },
    [setActiveIndexCPU]
  );

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const getinfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}/info`);
      if (response.data.success) {
        setDbinfo(response.data.infodb);
        setSvinfo(response.data.infosv);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const limit = 5;

  const getPostsHot = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts/hot/${limit}`);
      if (response.data.success) {
        setPostHot(response.data.posts_hot);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get info db and sv and hot posts
  useEffect(() => {
    let componentMounted = true;
    const fetchData = async () => {
      if (componentMounted) {
        getinfo();
        getPostsHot();
      }
    };
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  const renderActiveShapeDB = (props) => {
    // storage size
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {formatBytes(value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {payload.name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const datasizestorage = [
    { name: "Sử dụng", value: dbinfo.storageSize ? dbinfo.storageSize : 0 },
    {
      name: "Còn lại",
      value: dbinfo.totalFreeStorageSize
        ? dbinfo.totalFreeStorageSize
        : 536870912,
    },
  ];

  const renderActiveShapeRAM = (props) => {
    // ram size
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {formatBytes(value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {payload.name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const datasizeram = [
    {
      name: "Sử dụng",
      value: svinfo.totalmem
        ? svinfo.totalmem * 1024 * 1024 - svinfo.freemem * 1024 * 1024
        : 0,
    },
    {
      name: "Còn lại",
      value: svinfo.freemem ? svinfo.freemem * 1024 * 1024 : 0,
    },
  ];

  const renderActiveShapeCPU = (props) => {
    // ram size
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {`(${(value * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {payload.name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const datacpu = [
    {
      name: "Sử dụng",
      value: svinfo.cpuUsage ? svinfo.cpuUsage : 0,
    },
    {
      name: "Còn lại",
      value: svinfo.cpuFree ? svinfo.cpuFree : 0,
    },
  ];

  const FuncRefresh = () => {
    getinfo();
    getPostsHot();
  };

  return (
    <div
      style={{
        padding: " 2.75rem 2.25rem",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          title="Làm mới dữ liệu"
          style={{
            marginLeft: "10px",
            background: "#603ce4",
            border: "none",
            padding: 10,
          }}
          onClick={() => {
            FuncRefresh();
          }}
        >
          <HiRefresh />
        </Button>
      </div>
      <div
        style={{
          margin: "auto",
          width: "fit-content",
          padding: "10px",
          minHeight: "50vh",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "470px",
            padding: 10,
            margin: 10,
            background: "white",
            borderRadius: 15,
            paddingTop: 50,
          }}
        >
          <BarChart
            width={450}
            height={400}
            data={PostsHot}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" name="Số lượng học viên" />
            <Bar dataKey="videos" fill="#82ca9d" name="Số lượng video" />
            <Bar
              dataKey="avgrating"
              fill="#4d94ff"
              name="Trung bình đánh giá"
            />
            <Bar dataKey="sumprice" fill="#4d9454" name="Tổng thu nhập" />
            {/*<Bar dataKey="authorname" fill="#4d94ff" name="Tên tác giả" />*/}
          </BarChart>
          <p>
            <center>
              <b>Danh sách top {limit} khóa học nổi bật</b>
            </center>
          </p>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "470px",
            padding: 10,
            margin: 10,
            background: "white",
            borderRadius: 15,
          }}
        >
          <PieChart width={450} height={400}>
            <Pie
              activeIndex={activeIndexDB}
              activeShape={renderActiveShapeDB}
              data={datasizestorage}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#77ff33"
              dataKey="value"
              onMouseEnter={onPieEnterDB}
            />
          </PieChart>
          <p>
            <center>
              <b>
                Dữ liệu thống kê bộ nhớ csdl (Trung bình:{" "}
                {dbinfo.avgObjSize
                  ? formatBytes(dbinfo.avgObjSize) + "/ bản ghi"
                  : 0}
                )
              </b>
            </center>
            <b style={{ marginLeft: "12px" }}>
              Bao gồm:
              <br />
              <ul>
                <li>
                  {dbinfo.collections
                    ? dbinfo.collections + " Bảng Tài Liệu"
                    : 0}
                </li>
                <li>{dbinfo.objects ? dbinfo.objects + " Bản ghi" : 0}</li>
              </ul>
            </b>
          </p>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "470px",
            padding: 10,
            margin: 10,
            background: "white",
            borderRadius: 15,
          }}
        >
          <PieChart width={450} height={400}>
            <Pie
              activeIndex={activeIndexRAM}
              activeShape={renderActiveShapeRAM}
              data={datasizeram}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#4d94ff"
              dataKey="value"
              onMouseEnter={onPieEnterRAM}
            />
          </PieChart>
          <p>
            <center>
              <b>Dữ liệu thống kê RAM</b>
            </center>
            <b style={{ marginLeft: "12px" }}>
              {svinfo.totalmem
                ? "Tổng dung lượng: " +
                  formatBytes(svinfo.totalmem * 1024 * 1024)
                : 0}
              <br />
              <ul>
                <li>
                  {svinfo.totalmem
                    ? "Sử dụng: " +
                      formatBytes(
                        svinfo.totalmem * 1024 * 1024 -
                          svinfo.freemem * 1024 * 1024
                      )
                    : 0}
                </li>
                <li>
                  {svinfo.freemem
                    ? "Còn lại: " + formatBytes(svinfo.freemem * 1024 * 1024)
                    : 0}
                </li>
              </ul>
            </b>
          </p>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "470px",
            padding: 10,
            margin: 10,
            background: "white",
            borderRadius: 15,
          }}
        >
          <PieChart width={450} height={400}>
            <Pie
              activeIndex={activeIndexCPU}
              activeShape={renderActiveShapeCPU}
              data={datacpu}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnterCPU}
            />
          </PieChart>
          <p>
            <center>
              <b>Dữ liệu thống kê CPU</b>
            </center>
            <b style={{ marginLeft: "12px" }}>
              Chi tiết
              <br />
              <ul>
                <li>
                  {svinfo.cpuUsage
                    ? "Sử dụng: " + (svinfo.cpuUsage * 100).toFixed(2) + "%"
                    : 0}
                </li>
                <li>
                  {svinfo.cpuFree
                    ? "Còn lại: " + (svinfo.cpuFree * 100).toFixed(2) + "%"
                    : 0}
                </li>
              </ul>
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
