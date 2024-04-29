import "../App.css";
import { Button, Col, Form, Select } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tags from "../assets/restaurantType.json";
import times from "../assets/times.json";
import httpRequest from "../config/http-request";
import {
  EnvironmentOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";
const { Option } = Select;
function Home() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [dataFamousRestaurant, setDataFamousRestaurant] = useState([]);
  const [form] = Form.useForm();
  const [dataSearch, setDataSearch] = useState(null);
  const [dataTinhThanh] = useState([
    { id: 1, ten: "Hà Nội" },
    { id: 2, ten: "Hồ Chí Minh" },
    { id: 3, ten: "Hải Phòng" },
    { id: 4, ten: "Đà Nẵng" },
    { id: 5, ten: "Cần Thơ" },
    { id: 6, ten: "An Giang" },
    { id: 7, ten: "Bà Rịa - Vũng Tàu" },
    { id: 8, ten: "Bắc Giang" },
    { id: 9, ten: "Bắc Kạn" },
    { id: 10, ten: "Bạc Liêu" },
    { id: 11, ten: "Bắc Ninh" },
    { id: 12, ten: "Bến Tre" },
    { id: 13, ten: "Bình Định" },
    { id: 14, ten: "Bình Dương" },
    { id: 15, ten: "Bình Phước" },
    { id: 16, ten: "Bình Thuận" },
    { id: 17, ten: "Cà Mau" },
    { id: 18, ten: "Cao Bằng" },
    { id: 19, ten: "Đắk Lắk" },
    { id: 20, ten: "Đắk Nông" },
    { id: 21, ten: "Điện Biên" },
    { id: 22, ten: "Đồng Nai" },
    { id: 23, ten: "Đồng Tháp" },
    { id: 24, ten: "Gia Lai" },
    { id: 25, ten: "Hà Giang" },
    { id: 26, ten: "Hà Nam" },
    { id: 27, ten: "Hà Tĩnh" },
    { id: 28, ten: "Hải Dương" },
    { id: 29, ten: "Hậu Giang" },
    { id: 30, ten: "Hòa Bình" },
    { id: 31, ten: "Hưng Yên" },
    { id: 32, ten: "Khánh Hòa" },
    { id: 33, ten: "Kiên Giang" },
    { id: 34, ten: "Kon Tum" },
    { id: 35, ten: "Lai Châu" },
    { id: 36, ten: "Lâm Đồng" },
    { id: 37, ten: "Lạng Sơn" },
    { id: 38, ten: "Lào Cai" },
    { id: 39, ten: "Long An" },
    { id: 40, ten: "Nam Định" },
    { id: 41, ten: "Nghệ An" },
    { id: 42, ten: "Ninh Bình" },
    { id: 43, ten: "Ninh Thuận" },
    { id: 44, ten: "Phú Thọ" },
    { id: 45, ten: "Quảng Bình" },
    { id: 46, ten: "Quảng Nam" },
    { id: 47, ten: "Quảng Ngãi" },
    { id: 48, ten: "Quảng Ninh" },
    { id: 49, ten: "Quảng Trị" },
    { id: 50, ten: "Sóc Trăng" },
    { id: 51, ten: "Sơn La" },
    { id: 52, ten: "Tây Ninh" },
    { id: 53, ten: "Thái Bình" },
    { id: 54, ten: "Thái Nguyên" },
    { id: 55, ten: "Thanh Hóa" },
    { id: 56, ten: "Thừa Thiên Huế" },
    { id: 57, ten: "Tiền Giang" },
    { id: 58, ten: "Trà Vinh" },
    { id: 59, ten: "Tuyên Quang" },
    { id: 60, ten: "Vĩnh Long" },
    { id: 61, ten: "Vĩnh Phúc" },
    { id: 62, ten: "Yên Bái" },
    { id: 63, ten: "Phú Yên" },
    { id: 64, ten: "Cần Giờ" },
  ]);

  const onSearch = (value, _e, info) => {
    httpRequest
      .get("/restaurant", {
        params: {
          search: searchValue,
          provinceId: form.getFieldValue("provinceId"),
        },
      })
      .then((response) => {
        const tag = form.getFieldValue("tag");
        const workingTime = form.getFieldValue("workingTime");
        const list = [];
        if (tag !== undefined || workingTime !== undefined) {
          for (const item of response.data.data) {
            const dataTags = item.tags ? JSON.parse(item.tags) : [];
            const dataTimes = item.workingTime
              ? JSON.parse(item.workingTime)
              : [];
            const checkTag = dataTags.find((x) => x === tag);
            const checkWorkingTime = dataTimes.find((x) => x === workingTime);
            if (checkTag !== undefined || checkWorkingTime !== undefined)
              list.push(item);
          }
        } else {
          list.push(...response.data.data);
        }
        setDataSearch(list);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    httpRequest
      .get("/restaurant")
      .then((response) => {
        const data = response.data.data.sort((a, b) => b.rateCount - a.rateCount);
        const dataSlice = data.slice(0, 5);
        setDataFamousRestaurant(dataSlice);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      <div className="relative">
        <img
          className="cursor-pointer w-full h-[350px] object-cover"
          src="https://static.toiimg.com/thumb/msid-101282760,width-1280,height-720,resizemode-4/101282760.jpg"
          alt=""
          title=""
        />
        <div className="flex justify-center">
          <div className="flex justify-center w-2/3 text-center absolute top-[250px] bg-gray-100 p-8 rounded-2xl shadow-xl shadow-gray-400 border-2 border-amber-800">
            <div className="w-full">
              <Search
                placeholder="Tìm kiếm nhà hàng"
                allowClear
                size="large"
                onSearch={onSearch}
                onChange={onChange}
              />
              <div className="flex justify-center mt-4">
                <Form form={form} className="w-full grid grid-cols-3 gap-2">
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="provinceId"
                      label=""
                      labelCol={{ span: 5 }}
                    >
                      <Select
                        size="large"
                        allowClear
                        optionFilterProp="label"
                        showSearch
                        className="w-1/2"
                        placeholder="Chọn tỉnh, thành phố"
                        options={dataTinhThanh.map((item) => ({
                          value: item.id,
                          label: item.ten,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      name="tag"
                      label=""
                      labelCol={{ span: 5 }}
                    >
                      <Select
                        size="large"
                        allowClear
                        optionFilterProp="label"
                        showSearch
                        className="w-1/2"
                        placeholder="Chọn loại nhà hàng"
                        options={tags.map((item) => ({
                          value: item.key,
                          label: item.value,
                        }))}
                      />
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
                        size="large"
                        allowClear
                        optionFilterProp="label"
                        showSearch
                        className="w-1/2"
                        placeholder="Chọn thời gian"
                      >
                        {times?.map((time) => (
                          <Option key={time} value={time}>
                            {time}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Form>
              </div>
              <Button
                type={"primary"}
                style={{ backgroundColor: "brown" }}
                className="w-[300px] h-[65px] mt-8 "
                onClick={onSearch}
              >
                <span className="text-2xl">Tìm kiếm</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-52 mb-20 flex justify-center text-center">
          {dataSearch && (
            <div className="w-1/2 my-10 mt-28">
              <span className="text-3xl text-center font-semibold ">
                Danh sách nhà hàng tìm kiếm
              </span>
              <div className="grid grid-cols-3 gap-4">
                {dataSearch?.map((data) => (
                  <div
                    className="rounded-2xl border-2 shadow-xl hover:scale-105 ease-in-out duration-300 mt-4 bg-white"
                    onClick={() => navigate(`/product-detail?id=${data.id}`)}
                  >
                    <img
                      className="cursor-pointer w-full aspect-video rounded-t-2xl object-contain"
                      src={
                        data.gallery
                          ? `http://localhost:3002${data.gallery}`
                          : "/default_img.png"
                      }
                      alt=""
                      title=""
                    />
                    <div className="text-left pl-3 my-2">
                      <p className="font-semibold text-2xl mb-2 text-left">
                        {data.name}{" "}
                      </p>
                      <p>
                        <StarOutlined style={{ color: "red" }} />{" "}
                        {Number(data.rateTotal)}{" "}
                        <span>{`(${data.rateCount})`}</span>
                      </p>
                      <p className="my-2">
                        <EnvironmentOutlined /> {data.address}
                      </p>
                    </div>
                    <div className="my-8 float-end mr-4">
                      <Button
                        className="w-[150px] h-[40px]"
                        style={{ backgroundColor: "brown" }}
                      >
                        Xem thêm
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mb-24  flex justify-center text-center relative">
          <div className="w-3/4">
            <span className="text-3xl text-center font-semibold ">
              Nhà hàng nổi bật <FireOutlined style={{ color: "red" }} />
            </span>
            <div className="grid grid-cols-5 gap-6 ">
              {dataFamousRestaurant.map((data) => (
                <div
                  className=" rounded-2xl border-2 shadow-xl hover:scale-105 ease-in-out duration-300 mt-8 bg-white"
                  onClick={() => navigate(`/product-detail?id=${data.id}`)}
                >
                  <img
                    className="cursor-pointer w-full object-cover rounded-t-2xl aspect-video"
                    src={
                      data.gallery
                        ? `http://localhost:3002${data.gallery}`
                        : "/default_img.png"
                    }
                    alt=""
                    title=""
                  />
                  <div className="text-left pl-3 my-4 h-[150px]">
                    <p className="font-semibold text-2xl mb-2 text-left line-clamp-2 h-16">
                      {data.name}{" "}
                    </p>
                    <p>
                      <StarOutlined style={{ color: "red" }} />{" "}
                      {Number(data.rateTotal)}{" "}
                      <span>{`(${data.rateCount})`}</span>
                    </p>
                    <p className="my-2">
                      <EnvironmentOutlined /> {data.address}
                    </p>
                  </div>
                  <div className="my-4 float-end mr-4 flex items-end ">
                    <Button
                      type=""
                      className="w-[150px] h-[40px] text-white"
                      style={{ backgroundColor: "brown" }}
                    >
                      Xem thêm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
