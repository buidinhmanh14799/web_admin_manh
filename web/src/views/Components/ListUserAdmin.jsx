import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "./Card/Card.jsx";
import CardHeader from "./Card/CardHeader.jsx";
import CardBody from "./Card/CardBody.jsx";
import "antd/dist/antd.css";
import { Table, Tag, Space, Button, Modal, notification } from "antd";

import AddAdminForm from './AddAdminForm';
const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);


export default function UploadData() {

  const classes = useStyles();
  const [visibleEdit, setVisibleEdit] = React.useState(false);  // load model edit admin
  const [isModalVisible, setIsModalVisible] = useState(false); // load model add admin
  const [loadingAdd, setLoadingAdd] = React.useState(false);
  const [loadingEdit, setLoadingEdit] = React.useState(false);
  const [adminCurrent, setAdminCurrent] = React.useState([]); // admin current
  const [modalText, setModalText] = React.useState('Bạn có chắc chắn muốn disable admin không?'); // model edit admin
  const [reload, setReload] = React.useState(true) // reload
  const [data, setData] = React.useState([]); // data
  // input add user admin

  // get list admin
  const getData = async () => {
    return await fetch(`https://toeic-seb.herokuapp.com/admin/`)
      .then(response => response.json())
      .then(data => {
        let array = data.map(element => {
          return {
            id: element._id,
            name: element.name,
            email: element.email,
            status: element['status']?.toString(),
            role: element.role,
          }
        })
     
        setData(array);
      });
  }
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
  ];
  useEffect(() => {
    getData();
  }, [reload])

  // show modal admin
  const showModal = () => {
    setIsModalVisible(true);
  };
  // ok add admin
  const handleOk = (values) => {
    
    signUp(values)
      .then(data => {
        if (data !== 'erro') {
          openNotification('Thêm admin thành công.');
          setReload(!reload);
        }
        else {
          openNotification('Thêm admin thất bại!!');
        }
      });
    setIsModalVisible(false);
  };
  // notication add admin
  const openNotification = (content) => {
    const args = {
      message: 'Thông báo!!',
      description: content,
      duration: 0,
    };
    notification.open(args);
  };
  // cancel admin
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  // add admin
  const signUp = async (values) => {
    return new Promise((resolve, reject) => {
      fetch(`https://toeic-seb.herokuapp.com/admin/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*",
          mode: 'no-cors'
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.confirm,
          phone: values.phone
        }),
      }).then((data) => {
        resolve(data);
      }).catch((erro)=>{reject('erro')})
    });
  }
  // api edit admin
  const editAdmin = async () => {
    let query = `https://toeic-seb.herokuapp.com/admin/disable/${adminCurrent.id}`;
    if(adminCurrent.status === "false"){
      query = `https://toeic-seb.herokuapp.com/admin/enable/${adminCurrent.id}`;
    }
    return new Promise((resolve, reject) => {
      fetch(query, {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*",
          mode: 'no-cors'
        },
        body: JSON.stringify({
        }),
      }).then((data) => {
        setLoadingEdit(false);
        setReload(!reload);
        resolve(data);
      })
    });
  }
  // edit admin
  const handleOkEdit = () => {
    setLoadingEdit(true);
    editAdmin();
    setVisibleEdit(false);
  };
  // cancel edit
  const handleCancelEdit = () => {
    setVisibleEdit(false);
    setLoadingEdit(false);
  };
  return (
    <Card>
      <CardHeader color="primary">
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            <h4 className={classes.cardTitleWhite}>List admin</h4>
          </div>
          <div style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', display: 'flex' }}>
            <Button onClick={
              showModal
            }>Add admin</Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Modal title="Add data" visible={isModalVisible} confirmLoading={loadingAdd} footer={null} onCancel={handleCancel}>
          <AddAdminForm handleOk={handleOk} />
        </Modal>
        <Modal
          title="Thông báo"
          visible={visibleEdit}
          onOk={handleOkEdit}
          confirmLoading={loadingEdit}
          onCancel={handleCancelEdit}
        >
          <p>{modalText}</p>
        </Modal>
        <Table
          columns={columns}
          dataSource={data}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: event => {
                setAdminCurrent(data[rowIndex]);
                if (data[rowIndex].status === "true") {
                  setModalText('Bạn có chắc chắn muốn disable admin không?');
                } else {
                  setModalText('Bạn có chắc chắn muốn enable admin không?');
                }
                setVisibleEdit(true);
              }, // double click row           
            };
          }}
        />
      </CardBody>
    </Card>
  );
}
