import React, { Component } from 'react';
import { Query } from 'react-apollo';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import {
  ButtonGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';
import ManagementModal from './ManagementModal';

export default class UserManagement extends Component {
  constructor(props) {
    super(props);

    this.refetch = null;

    this.state = {
      variables: {
        limit: 10,
        page: 1
      },
      modal: {
        active: false,
        mode: '',
        userData: {}
      }
    };
  }

  deleteUser(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.deleteUser,
        variables: {
          userId: id
        }
      })
      .then(({ data }) => {
        if (data && data.deleteUser && data.deleteUser.success === true) {
          notify.success('Xoá người dùng thành công!');
          this.refetch();
        }
      });
  }

  columnOptions = [
    {
      dataField: 'id',
      text: 'STT',
      align: 'center',
      headerAlign: 'center',
      formatter: (cell, row, rowIndex) =>
        (this.state.variables.page - 1) * 10 + rowIndex + 1
    },
    {
      dataField: 'username',
      text: 'Tên đăng nhập'
    },
    {
      dataField: 'nickname',
      text: 'Bút danh'
    },
    {
      dataField: 'email',
      text: 'Email'
    },
    {
      dataField: 'gender',
      text: 'Giới tính',
      formatter: cell => {
        let gender = '';
        switch (cell) {
          case 'MALE':
            gender = 'Nam';
            break;
          case 'FEMALE':
            gender = 'Nữ';
            break;
          case 'OTHERS':
            gender = 'Khác';
            break;
          default:
            gender = 'Nam';
            break;
        }
        return gender;
      }
    },
    {
      dataField: 'birthDate',
      text: 'Ngày sinh',
      formatter: cell => moment(cell).format('DD/MM/YYYY')
    },
    {
      dataField: 'isDel',
      text: 'Trạng thái',
      formatter: cell => (cell === true ? 'Đã xóa' : 'Đang hoạt động'),
      style: (cell, row, rowIndex, colIndex) => {
        if (cell) {
          return {
            backgroundColor: 'orangered',
            color: 'white'
          };
        }
        return {
          backgroundColor: 'limegreen',
          color: 'white'
        };
      }
    },
    {
      dataField: '',
      text: 'Thao tác',
      align: 'center',
      headerAlign: 'center',
      formatter: (cell, row) => {
        if (row.isDel === true) {
          return '';
        }

        return (
          <ButtonGroup size="sm">
            <Button
              outline
              color="success"
              onClick={() => this.toggleModal('update', row)}
            >
              <i className="fa fa-edit" /> Sửa
            </Button>
            {row.username !== 'superadmin' && (
              <Button
                outline
                color="danger"
                onClick={async () => {
                  const confirmResult = await this.props.commonComps.CommonConfirm(
                    {
                      message: 'Bạn chắc chắn muốn xoá người dùng này?',
                      confirmText: 'Xoá',
                      confirmColor: 'primary',
                      cancelText: 'Không',
                      cancelColor: 'danger'
                    }
                  );
                  confirmResult && this.deleteUser(row.id);
                }}
              >
                <i className="fa fa-times" /> Xoá
              </Button>
            )}
          </ButtonGroup>
        );
      }
    }
  ];

  toggleModal = (mode = '', row = {}) => {
    this.setState({
      modal: {
        active: !this.state.modal.active,
        mode,
        userData: {
          newDisplayName: row.displayName,
          newRoleId: row.roleId,
          ...row
        }
      }
    });
  };

  handlePageChange = (pageNumber, limit) => {
    if (this.state.variables.page === pageNumber) {
      return;
    }
    this.setState({
      variables: {
        page: pageNumber,
        limit: limit
      }
    });
  };

  render() {
    const {
      commonProps: {
        queries: { query }
      },
      commonComps: { CommonLoading, CommonRedirect, CommonPagination, Page500 }
    } = Common;

    return (
      <Subscribe to={[GlobalContext]}>
        {context => {
          if (!context.state.isLoggedIn) {
            return (
              <CommonRedirect redirectTo="/login" message="Chưa đăng nhập" />
            );
          }

          return (
            <Card>
              <CardHeader>
                Quản lý người dùng
                <Button
                  outline
                  color="primary"
                  className="float-right"
                  onClick={() => this.toggleModal('create')}
                >
                  <i className="fa fa-plus" /> Thêm người dùng
                </Button>
              </CardHeader>
              <CardBody>
                <Query
                  query={query.getAllUsers}
                  variables={{ options: { ...this.state.variables } }}
                >
                  {({ loading, error, data, refetch }) => {
                    this.refetch = refetch;

                    if (loading) {
                      return <CommonLoading />;
                    }
                    if (error && error.networkError) {
                      return <Page500 />;
                    }
                    if (
                      data &&
                      data.getAllUsers &&
                      data.getAllUsers.success === true
                    ) {
                      return (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            striped
                            hover
                            keyField="id"
                            data={data.getAllUsers.users.docs}
                            columns={this.columnOptions}
                          />
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={data.getAllUsers.users.pages}
                            itemPerPage={this.state.variables.limit}
                            onPageChange={pageNumber =>
                              this.handlePageChange(pageNumber.selected + 1)
                            }
                          />
                          <Modal
                            isOpen={this.state.modal.active}
                            toggle={this.toggleModal}
                            className={`modal-lg ${
                              this.state.modal.mode === 'create'
                                ? 'modal-primary'
                                : 'modal-success'
                            } ${this.props.className}`}
                          >
                            <ModalHeader toggle={this.toggleModal}>
                              {this.state.modal.mode === 'create'
                                ? 'Thêm người dùng'
                                : 'Chỉnh sửa người dùng'}
                            </ModalHeader>
                            <ModalBody>
                              <ManagementModal
                                mode={this.state.modal.mode}
                                closeModal={this.toggleModal}
                                refresh={refetch}
                                userData={this.state.modal.userData}
                                {...this.props}
                              />
                            </ModalBody>
                          </Modal>
                        </React.Fragment>
                      );
                    }
                  }}
                </Query>
              </CardBody>
            </Card>
          );
        }}
      </Subscribe>
    );
  }
}
