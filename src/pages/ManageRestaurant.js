import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tag,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import httpRequest from "../config/http-request";
import { useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import restaurantType from "../assets/restaurantType.json";
import times from "../assets/times.json"
import dataTinhThanhJson from "../assets/tinhThanh.json";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function ManageRestaurant() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fileList, setFileList] = useState([]);
  const [fileListMenu, setFileListMenu] = useState([]);
  const [img, setImg] = useState("");
  const [imgMenu, setImgMenu] = useState("");
  const [search, setSearch] = useState("");
  const { Search } = Input;
  const [dataTinhThanh] = useState(dataTinhThanhJson);
  const userInfo = useSelector((state) => state.author.information);
  const navigate = useNavigate();

  const onChange = ({ file, fileList: newFileList }) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImg(reader.result);
      setFileList(newFileList);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeMenu = ({ file, fileList: newFileList }) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImgMenu(reader.result);
      setFileListMenu(newFileList);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrent(page);
    setPageSize(pageSize);
    getRestaurant(page);
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  function clearData() {
    setFileList([]);
    setFileListMenu([]);
    setImg("");
    setImgMenu("");
  }

  const handleCancel = () => {
    clearData();
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

  const columns = [
    {
      title: "No",
      dataIndex: "stt",
      render: (val, row, index) => index + 1,
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "address",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tag, row) => (
        <div className="flex flex-wrap">
          {tag.map((element) => (
            <Tag color="processing">
              {restaurantType.find((x) => x.key === element).value}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Working Time",
      dataIndex: "workingTime",
      key: "workingTime",
      render: (time, row) => (
        <div className="flex flex-wrap">
          {time.map((element) => (
            <Tag color="processing">
              {times.find((x) => x.key === element).value}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      render: (val, row) => (
        <div>
          <Button onClick={() => navigate(`/manage-booking?id=${row.id}`)}>
            View Booking
          </Button>
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
      width: 200,
    },
  ];

  function handleEdit(id) {
    httpRequest
      .get(`/restaurant/${id}`)
      .then((response) => {
        showModal();
        setImg(
          response.data.gallery
            ? `http://localhost:3002${response.data.gallery}`
            : ""
        );
        setImgMenu(
          response.data.menu ? `http://localhost:3002${response.data.menu}` : ""
        );
        response.data.tags = JSON.parse(response.data?.tags || "[]");
        response.data.workingTime = JSON.parse(response.data?.workingTime || "[]");
        setDescription(response.data.description);
        setRules(response.data.rules);
        response.data.emptyTable = JSON.parse(
          response.data?.emptyTable || "[]"
        );
        for (const item of response.data.emptyTable) {
          item.date = dayjs(item.date);
        }
        form.setFieldsValue(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleDelete = (id) => {
    httpRequest
      .delete(`/restaurant/${id}`)
      .then((response) => {
        getRestaurant();
        success("Delete Success");
      })
      .catch((err) => {
        error(err.response.data.message);
      });
  };

  function getRestaurant(page) {
    form.resetFields();
    httpRequest
      .get("/userCheck/restaurant", {
        params: {
          page: page || current,
          search: search,
        },
      })
      .then((response) => {
        const dataResponse = response.data.data;
        for (const item of dataResponse) {
          item.tags = JSON.parse(item.tags || "[]");
          item.workingTime = JSON.parse(item.workingTime || "[]");
        }
        setData(dataResponse);
        setDescription(data.description);
        setTotal(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addRestaurant(dataUpload) {
    httpRequest
      .post("/restaurant", dataUpload)
      .then((response) => {
        getRestaurant();
        success("Add Success");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function updateRestaurant(cleanObject) {
    const id = cleanObject.id;
    delete cleanObject.id;
    httpRequest
      .put(`/restaurant/${id}`, cleanObject)
      .then((response) => {
        getRestaurant();
        success("Update Success");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function handleUpload() {
    try {
      let path = "";
      const formData = new FormData();
      if (fileList.length) {
        const originFileObj = fileList[0].originFileObj;
        formData.append("file", originFileObj, originFileObj.name);
        const res = await httpRequest.post(`/file/upload`, formData);
        path = res.data.path;
        form.setFieldValue("gallery", path);
      }
      let pathMenu = "";
      const formDataMenu = new FormData();
      if (fileListMenu.length) {
        const originFileObj = fileListMenu[0].originFileObj;
        formDataMenu.append("file", originFileObj, originFileObj.name);
        const res = await httpRequest.post(`/file/upload`, formDataMenu);
        pathMenu = res.data.path;
        form.setFieldValue("menu", pathMenu);
      }
      const dataUpload = form.getFieldsValue(true);
      delete dataUpload.rateTotal;
      delete dataUpload.rate;
      delete dataUpload.comments;
      delete dataUpload.rateCount;
      dataUpload.description = description;
      dataUpload.rules = rules;
      dataUpload.userId = userInfo.user.id;
      dataUpload.tags = dataUpload.tags ? JSON.stringify(dataUpload.tags) : "";
      dataUpload.workingTime = dataUpload.workingTime ? JSON.stringify(dataUpload.workingTime) : "";
      dataUpload.emptyTable = dataUpload.emptyTable
        ? JSON.stringify(dataUpload.emptyTable)
        : "";
      // const obj = cleanObject(form.getFieldsValue(true))
      if (dataUpload.email && dataUpload.name) {
        form.getFieldValue("id")
          ? updateRestaurant(dataUpload)
          : addRestaurant(dataUpload);
      } else {
        message.error("Please Enter Full Information");
      }
      clearData();
    } catch (error) {
      console.log(error);
    }
  }

  const onSearch = (value, _e, info) => {
    getRestaurant(1);
  };

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
            <h1 className="text-2xl font-semibold my-10">Manage Restaurant</h1>
            <div className="float-end mb-5 flex gap-3">
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                onClick={showModal}
                style={{ backgroundColor: "brown" }}
              >
                Create
              </Button>
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
      <Modal
        open={open}
        width={1000}
        title="Create Restaurant"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <div className="flex justify-end">
            <CancelBtn />
            <div onClick={handleUpload} className="ml-2">
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
                name="name"
                label="Name"
                labelCol={{ span: 5 }}
                rules={[{ required: true, message: "Please Enter Name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="email"
                label="Email"
                labelCol={{ span: 5 }}
                rules={[
                  { required: true, message: "Enter email!" },
                  {
                    type: "email",
                    message: "Wrong Format",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="address"
                label="Address"
                labelCol={{ span: 5 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="provinceId"
                label="Province"
                labelCol={{ span: 5 }}
              >
                <Select
                  optionFilterProp="label"
                  showSearch
                  className="w-1/2"
                  options={dataTinhThanh.map((item) => ({
                    value: item.id,
                    label: item.name || null,
                  }))}
                />
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
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                label="Tags"
                name="tags"
                labelCol={{ span: 5 }}
              >
                <Select
                  mode="multiple"
                  options={restaurantType.map((item) => {
                    return { label: item.value, value: item.key };
                  })}
                ></Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                label="Working Time"
                labelCol={{ span: 5 }}
                name="workingTime"
              >
                <Select
                  mode="multiple"
                  options={times.map((item) => {
                    return { label: item.value, value: item.key };
                  })}
                ></Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                label="Table"
                labelCol={{ span: 5 }}
              >
                <Form.List name="emptyTable">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Form.Item key={key}>
                          <div className="flex gap-2">
                            <div className="grid grid-cols-3 gap-2 w-full">
                              <Form.Item
                                {...restField}
                                name={[name, "date"]}
                                noStyle
                              >
                                <DatePicker />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                labelAlign="left"
                                label="Table Name"
                                name={[name, "name"]}
                                noStyle
                              >
                                <Input placeholder="Enter Table Name" />
                              </Form.Item>
                              <Form.Item
                                labelAlign="left"
                                label="Number of Seats"
                                {...restField}
                                name={[name, "people"]}
                                noStyle
                              >
                                <InputNumber className="w-full" min={1} />
                              </Form.Item>
                            </div>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(name)}
                              />
                            ) : null}
                          </div>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{
                            width: "60%",
                          }}
                          icon={<PlusOutlined />}
                        >
                          Create
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="website"
                label="Website"
                labelCol={{ span: 5 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="menu"
                label="Menu"
                labelCol={{ span: 5 }}
              >
                <Upload
                  fileList={fileListMenu}
                  onChange={onChangeMenu}
                  accept=".png"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <div className="border border-dashed w-[200px] h-[200px] flex justify-center items-center hover:opacity-70">
                    {imgMenu ? (
                      <div>
                        <img
                          className="w-full h-full object-cover"
                          src={imgMenu}
                          alt=""
                        />
                      </div>
                    ) : (
                      <UploadOutlined />
                    )}
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                name="gallery"
                label="Image"
                labelCol={{ span: 5 }}
              >
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  accept=".png"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <div className="border border-dashed w-[200px] h-[200px] flex justify-center items-center hover:opacity-70">
                    {img ? (
                      <div>
                        <img
                          className="w-full h-full object-cover"
                          src={img}
                          alt=""
                        />
                      </div>
                    ) : (
                      <UploadOutlined />
                    )}
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item labelAlign="left" label="Description" labelCol={{ span: 5 }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    setDescription(editor?.getData());
                  }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelAlign="left"
                label="Rule"
                labelCol={{ span: 5 }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={rules}
                  onChange={(event, editor) => {
                    setRules(editor?.getData());
                  }}
                />
              </Form.Item>
            </Col>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default ManageRestaurant;
