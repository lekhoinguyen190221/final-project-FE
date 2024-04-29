import {
  Button,
  Form,
  Input,
  message,
  Pagination,
  Popconfirm,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import httpRequest from "../config/http-request";
import restaurantType from "../assets/restaurantType.json";
import dayjs from "dayjs";
import moment from "moment";

function ManageRestaurant() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { Search } = Input;
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  const handlePageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
    getRestaurant(page);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "stt",
      render: (val, row, index) => index + 1,
      width: 60,
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val, row, index) => moment(val).format("DD/MM/YYYY"),
    },
  ];

  function getRestaurant(page) {
    form.resetFields();
    httpRequest
      .get("/booking", {
        params: {
          restaurantId: id,
          page: page || current,
          search: search,
        },
      })
      .then((response) => {
        const dataResponse = response.data.data;
        for (const item of dataResponse) {
          item.username = `${item.firstName} ${item.lastName}`;
        }
        setData(dataResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getRestaurant();
    if (form) {
      form.resetFields();
    }
  }, []);

  return (
    <>
      {contextHolder}
      <div className="w-full flex justify-center mb-20 h-[80vh]">
        <div className="w-2/3 justify-center text-center flex">
          <div className="mt-10 text-center">
            <h1 className="text-2xl font-semibold my-10">
              Manage Booking:{" "}
              {data.length ? data[0].restaurantName : ""}
            </h1>
            <Table
              columns={columns}
              dataSource={data}
              scroll={{ x: 500, y: 500 }}
              pagination={false}
            />
            <div className="mt-4">
              <Pagination
                current={current}
                pageSize={pageSize}
                total={total} // Tổng số dữ liệu
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageRestaurant;
