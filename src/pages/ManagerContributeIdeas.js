import {
  Button,
  Form,
  Input,
  message,
  Pagination,
  Popconfirm,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import httpRequest from "../config/http-request";

function ManagerContributeIdeas() {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { Search } = Input;

  const handlePageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
    getContributeIdeas(page);
  };

  const error = (response) => {
    messageApi.open({
      type: "error",
      content: response,
    });
  };

  const success = (response) => {
    messageApi.open({
      type: "success",
      content: response,
    });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Restaurant Name",
      dataIndex: "restaurantName",
      key: "restaurantName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Feedback",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Action",
      render: (val, row) => (
        <div>
          <Popconfirm
            title="Delete"
            description="Are you sure"
            onConfirm={() => handleDelete(row.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger className="ml-2">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = (id) => {
    httpRequest
      .delete(`/contributeIdeas/${id}`)
      .then((response) => {
        success("Delete Success");
        getContributeIdeas(1);
      })
      .catch((err) => {
        error(err.response.data.message);
      });
  };

  function getContributeIdeas(page) {
    form.resetFields();
    httpRequest
      .get(`/contributeIdeas`, {
        params: {
          page: page,
          search: search,
        },
      })
      .then((response) => {
        setData(response.data.data);
        setTotal(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const onSearch = (value, _e, info) => {
    getContributeIdeas(1);
  };

  useEffect(() => {
    getContributeIdeas(1);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="w-full flex justify-center mb-20 h-[80vh]">
        <div className="w-2/3 justify-center text-center flex">
          <div className="mt-10 text-center">
            <h1 className="text-2xl font-semibold my-10">Manage Feedback</h1>
            <div className="float-end mb-5 flex gap-3">
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
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

export default ManagerContributeIdeas;
