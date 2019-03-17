import React, { Component } from 'react';
import { Query } from 'react-apollo';
import BootstrapTable from 'react-bootstrap-table-next';
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

export default class RoleManagement extends Component {
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
        roleData: {}
      }
    };
  }

  deleteRole(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.deleteRole,
        variables: {
          roleId: id
        }
      })
      .then(({ data }) => {
        if (data && data.deleteRole && data.deleteRole.success === true) {
          notify.success('Xoá quyền thành công!');
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
      dataField: 'name',
      text: 'Tên quyền'
    },
    {
      dataField: 'description',
      text: 'Mô tả'
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
            <Button
              outline
              color="danger"
              onClick={async () => {
                const confirmResult = await this.props.commonComps.CommonConfirm(
                  {
                    message: 'Bạn chắc chắn muốn xoá quyền này?',
                    confirmText: 'Xoá',
                    confirmColor: 'primary',
                    cancelText: 'Không',
                    cancelColor: 'danger'
                  }
                );
                confirmResult && this.deleteRole(row.id);
              }}
            >
              <i className="fa fa-times" /> Xoá
            </Button>
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
        roleData: {
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
                Quản lý quyền
                <Button
                  outline
                  color="primary"
                  className="float-right"
                  onClick={() => this.toggleModal('create')}
                >
                  <i className="fa fa-plus" /> Thêm quyền
                </Button>
              </CardHeader>
              <CardBody>
                <Query
                  query={query.getAllRoles}
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
                      data.getAllRoles &&
                      data.getAllRoles.success === true
                    ) {
                      return (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            striped
                            hover
                            keyField="id"
                            data={data.getAllRoles.roles.docs}
                            columns={this.columnOptions}
                          />
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={data.getAllRoles.roles.pages}
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
                                ? 'Thêm quyền'
                                : 'Chỉnh sửa quyền'}
                            </ModalHeader>
                            <ModalBody>
                              <ManagementModal
                                mode={this.state.modal.mode}
                                closeModal={this.toggleModal}
                                refresh={refetch}
                                roleData={this.state.modal.roleData}
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
