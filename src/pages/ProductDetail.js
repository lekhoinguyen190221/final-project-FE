import React, { useEffect, useState } from "react";
import { Button, Col, Form, message, Rate, Select, Table, Tag } from "antd";
import httpRequest from "../config/http-request";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import { useSelector } from "react-redux";
import customers from "../assets/customers.json";
import timesData from "../assets/times.json";
import moment from "moment";
import tagsData from "../assets/restaurantType.json";

const { Option } = Select;
function ProductDetail() {
  const [searchParams] = useSearchParams();
  const id = +searchParams.get("id");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formBooking] = Form.useForm();
  const [data, setData] = useState({});
  const [comments, setComments] = useState([]);
  const userInfo = useSelector((state) => state.author.information);
  const [messageApi, contextHolder] = message.useMessage();
  const [tags, setTags] = useState([]);
  const [times, setTimes] = useState([]);
  const [emptyTable, setEmptyTable] = useState([]);
  const token = localStorage.getItem("token");
  const columnsTable = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (val) => moment(val).format("DD/MM/YYYY"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Seats",
      dataIndex: "people",
      key: "people",
    },
  ];

  function getRestaurant() {
    httpRequest
      .get(`/restaurant/${id}`)
      .then((response) => {
        setData(response.data);
        const tagsList = JSON.parse(response?.data?.tags || "[]");
        const timesList = JSON.parse(response?.data?.workingTime || "[]");
        const tagslist = [];
        const timeslist = [];
        for (const item of tagsData) {
          const tag = tagsList.find((x) => x === item.key);
          if (tag) {
            tagslist.push(item);
          }
        }
        for (const item of timesData) {
          const time = timesList.find((x) => x === item.key);
          if (time) {
            timeslist.push(item);
          }
        }
        setTags(tagslist || []);
        setTimes(timeslist || []);
        setEmptyTable(JSON.parse(response?.data?.emptyTable || "[]"));
        setComments(response?.data?.comments);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const success = (response) => {
    messageApi.open({
      type: "success",
      content: response,
    });
  };

  function handleComment() {
    form.setFieldsValue({
      restaurantId: id,
      userId: userInfo.user.id,
    });
    httpRequest
      .post(`/comment`, form.getFieldsValue(true))
      .then((response) => {
        success("Comment Success");
        getRestaurant();
        form.resetFields();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleContributeIdeas() {
    const dataPost = {
      restaurantId: id,
      userId: userInfo.user.id,
      comment: form.getFieldValue("contributeIdeas"),
    };
    httpRequest
      .post(`/contributeIdeas`, dataPost)
      .then((response) => {
        form.resetFields();
        success("Feedback Success");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleBooking() {
    if (!token) {
      navigate("/login");
    } else if (!userInfo?.user?.email) {
      navigate("/user");
    } else {
      const timeKey = times.find(x => x.key === formBooking?.getFieldValue("workingTime"))
      const dataPost = {
        restaurantId: id,
        userId: userInfo.user.id,
        note: `Ngày: ${moment(new Date()).format(
          "DD/MM/YYYY hh:mm:ss"
        )}, Thời gian đặt: ${timeKey?timeKey.value:""
        }, số người: ${formBooking?.getFieldValue("soNguoi")}`,
      };
      httpRequest
        .post(`/booking`, dataPost)
        .then((response) => {
          form.resetFields();
          success("Sent Success");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    getRestaurant();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex justify-center mb-10">
        <div className="w-2/3 mt-10 rounded-2xl border-2 shadow-2xl">
          <div className="p-4">
            <img
              className="cursor-pointer w-full h-[350px] rounded-2xl object-cover"
              src={
                data.gallery
                  ? `http://localhost:3002${data.gallery}`
                  : "/default_img.png"
              }
              alt=""
              title=""
            />
            <div className="flex justify-between">
              <div className="w-3/4 pr-10">
                <div className="my-8">
                  <p className="text-2xl font-semibold">
                    {data.name}{" "}
                    <Rate
                      allowHalf
                      value={
                        Number(data.rateTotal) / Number(data.rateCount) || 0
                      }
                      disabled
                    />
                  </p>
                  <p>{data.address}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((x) => (
                      <Tag color="processing">{x.value}</Tag>
                    ))}
                  </div>
                  <div className="px-4">
                    <div className="my-4 ">
                      <h4 className="font-semibold">Menu:</h4>
                      <img
                        className="cursor-pointer w-full h-[250px] rounded-2xl object-cover"
                        src={
                          data.menu
                            ? `http://localhost:3002${data.menu}`
                            : "/default_img.png"
                        }
                        alt=""
                        title=""
                      />
                    </div>
                    <div className="my-4 ">
                      <h4 className="font-semibold">Description:</h4>
                      <p
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      ></p>
                    </div>
                    <div className="my-4 ">
                      <h4 className="font-semibold">Rule:</h4>
                      <p dangerouslySetInnerHTML={{ __html: data.rules }}></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/4 mt-4">
                <div className="mt-10">
                  <h4 className="font-semibold">List of Table</h4>
                  <Table
                    columns={columnsTable}
                    dataSource={emptyTable}
                    pagination={false}
                  />
                </div>
                <div className=" my-10">
                  <h4 className="font-semibold">Working Time</h4>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {times.map((x) => (
                      <Tag color="processing">{x.value}</Tag>
                    ))}
                  </div>
                </div>
                <h4 className="font-semibold">Book</h4>
                <div className="text-center">
                  <Form form={formBooking}>
                    <Col>
                      <Form.Item
                        labelAlign="left"
                        name="soNguoi"
                        label=""
                        labelCol={{ span: 5 }}
                      >
                        <Select
                          allowClear
                          optionFilterProp="label"
                          showSearch
                          className="w-1/2"
                          placeholder="Number of Customer"
                        >
                          {customers.map((customer) => (
                            <Option key={customer} value={customer}>
                              {customer}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        labelAlign="left"
                        name="workingTime"
                        label=""
                        labelCol={{ span: 5 }}
                      >
                        <Select
                          allowClear
                          optionFilterProp="label"
                          showSearch
                          className="w-1/2"
                          placeholder="Time"
                          options={times.map((item) => {
                            return { label: item.value, value: item.key };
                          })}>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Form>
                </div>

                <Button
                  className="float-right w-[150px] h-[40px]"
                  type="primary"
                  onClick={handleBooking}
                  style={{ backgroundColor: "brown" }}
                >
                  Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-2/3 mt-10 flex">
          <div className="w-3/4 rounded-2xl border-2 shadow-2xl">
            <p className="p-4 text-xl">Comment and rate</p>
            <div className="">
              <div className="p-4">
                <Form form={form}>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="rate"
                      label=""
                      labelCol={{ span: 5 }}
                    >
                      <Rate allowHalf defaultValue={0} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="content"
                      label=""
                      labelCol={{ span: 5 }}
                    >
                      <TextArea placeholder="Enter text" size="large" />
                    </Form.Item>
                  </Col>
                </Form>
              </div>
              <div>
                <Button
                  onClick={handleComment}
                  type="primary"
                  className="w-[100px] h-[40px] float-end m-4"
                  style={{ backgroundColor: "brown" }}
                >
                  Send
                </Button>
              </div>
            </div>
            <div className="mt-20 p-4">
              {comments?.map((data) => (
                <div className="border-2 mb-2 p-4 rounded-2xl flex">
                  <div className="mr-2">
                    <img
                      width={50}
                      src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="mr-2 text-xl font-semibold">{`${data.firstName} ${data.lastName}`}</p>
                      <Rate allowHalf defaultValue={data.rate} disabled />
                    </div>
                    <p>{data.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ml-4 w-1/4">
            <p className="text-xl">Feedback</p>
            <div className="mt-2 ">
              <Form form={form}>
                <Col>
                  <Form.Item
                    labelAlign="left"
                    name="contributeIdeas"
                    label=""
                    labelCol={{ span: 5 }}
                  >
                    <TextArea
                      size="large"
                      stlyle={{ width: "100%" }}
                      placeholder="Enter Text"
                    />
                  </Form.Item>
                </Col>
              </Form>
            </div>
            <Button
              type="primary"
              className="m-4 float-end mr-0"
              onClick={handleContributeIdeas}
              style={{ backgroundColor: "brown" }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
