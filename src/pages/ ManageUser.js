import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
} from "antd";
import httpRequest from "../config/http-request";

function ManageUser() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { Search } = Input;

  const handlePageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
    getUser(page);
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
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

  function getUser(page) {
    setLoading(true);
    form.resetFields();
    httpRequest
      .get(`/user`, {
        params: {
          page: page || current,
          sortBy: sort,
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
    setLoading(false);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: true,
    },
    {
      title: "Action",
      render: (val, row) => (
        <div>
          <Button onClick={() => handleEdit(row.id)}>Edit</Button>
          <Popconfirm
            title="Delete"
            description="Are you sure?"
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

  function handleEdit(id) {
    httpRequest
      .get(`/user/${id}`)
      .then((response) => {
        showModal();
        form.setFieldsValue(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleDelete = (id) => {
    httpRequest
      .delete(`/user/${id}`)
      .then((response) => {
        success("Delete Success");
        getUser(1);
      })
      .catch((err) => {
        error(err.response.data.message);
      });
  };

  function addUser() {
    httpRequest
      .post("/user", form.getFieldsValue(true))
      .then((response) => {
        success("Add Success");
        getUser(1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function uppdateUser() {
    httpRequest
      .put(`/user/${form.getFieldValue("id")}`, form.getFieldsValue(true))
      .then((response) => {
        success("Update Success");
        getUser(1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleTableChange = (pagination, filters, sorter) => {
    // Extract the sorting parameters
    const { order } = sorter;
    order === "ascend" ? setSort("asc") : setSort("desc");
    // Call the API with the sorting parameters
    getUser();
  };

  const onSearch = (value, _e, info) => {
    getUser();
  };

  useEffect(() => {
    getUser(1);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="w-full flex justify-center mb-20 h-[80vh]">
        <div className="w-2/3 justify-center text-center flex">
          <div className="mt-10 text-center">
            <h1 className="text-2xl font-semibold my-10">Manage Account</h1>
            <div className="float-end mb-5 flex gap-3">
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={showModal} style={{ backgroundColor: 'brown' }}>
                Create
              </Button>
            </div>
            <Table
              columns={columns}
              loading={loading}
              dataSource={data}
              scroll={{ x: 500, y: 500 }}
              pagination={false}
              onChange={handleTableChange}
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
      <Modal
        open={open}
        title="Create Account"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <div className="flex justify-end">
            <CancelBtn />
            <div
              onClick={form.getFieldValue("id") ? uppdateUser : addUser}
              className="ml-2"
            >
              <OkBtn />
            </div>
          </div>
        )}
      >
        <div className="mt-4">
          <Form form={form}>
            <Col>
              <Form.Item
                labelAlign="left"
                name="firstName"
                label="Name"
                labelCol={{ span: 5 }}
              >
                <Input placeholder="Enter Fullname" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="email"
                label="Email"
                labelCol={{ span: 5 }}
                rules={[
                  {
                    type: "email",
                    message: "Wrong Format",
                  },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="password"
                label="Password"
                labelCol={{ span: 5 }}
              >
                <Input placeholder="Enter Password" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="phoneNumber"
                label="Phone Number"
                labelCol={{ span: 5 }}
                rules={[
                  {
                    pattern: /^(?:\d*)$/,
                    message: "Just number",
                  },
                ]}
              >
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="role"
                label="Role"
                labelCol={{ span: 5 }}
              >
                <Select
                  options={[
                    {
                      label: "User",
                      value: "user",
                    },
                    {
                      label: "Manager",
                      value: "manager",
                    },
                    {
                      label: "Admin",
                      value: "admin",
                    },
                  ]}
                  placeholder="Select Role"
                />
              </Form.Item>
            </Col>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default ManageUser;
