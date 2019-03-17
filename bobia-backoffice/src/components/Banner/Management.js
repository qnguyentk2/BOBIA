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
import { SingleCheckbox } from '../common/Fields';

export default class BannerManagement extends Component {
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
        bannerData: {}
      }
    };

    this.updateBannerActive = this.updateBannerActive.bind(this);
  }

  updateBannerActive(el) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.updateBannerActive,
        variables: {
          id: parseInt(el.target.id, 10),
          isActive: el.target.checked
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.updateBannerActive &&
          data.updateBannerActive.success === true
        ) {
          this.refetch();
          notify.success('Cập nhật trạng thái kích hoạt thành công!');
        }
      });
  }

  deleteBanner(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.deleteBanner,
        variables: {
          bannerId: id
        }
      })
      .then(({ data }) => {
        if (data && data.deleteBanner && data.deleteBanner.success === true) {
          notify.success('Xoá banner thành công!');
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
      text: 'Tên banner'
    },
    {
      dataField: 'title',
      text: 'Tiêu đề'
    },
    {
      dataField: 'isActive',
      text: 'Kích hoạt',
      align: 'center',
      formatter: (cell, row) => (
        <SingleCheckbox
          id={row.id}
          name="isActive"
          value={cell}
          toggle={true}
          onChange={this.updateBannerActive}
        />
      )
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
                    message: 'Bạn chắc chắn muốn xoá banner này?',
                    confirmText: 'Xoá',
                    confirmColor: 'primary',
                    cancelText: 'Không',
                    cancelColor: 'danger'
                  }
                );
                confirmResult && this.deleteBanner(row.id);
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
        bannerData: {
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
                Quản lý banner
                <Button
                  outline
                  color="primary"
                  className="float-right"
                  onClick={() => this.toggleModal('create')}
                >
                  <i className="fa fa-plus" /> Thêm banner
                </Button>
              </CardHeader>
              <CardBody>
                <Query
                  query={query.getAllBanners}
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
                      data.getAllBanners &&
                      data.getAllBanners.success === true
                    ) {
                      return (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            striped
                            hover
                            keyField="id"
                            data={data.getAllBanners.banners.docs}
                            columns={this.columnOptions}
                          />
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={data.getAllBanners.banners.pages}
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
                            style={{ maxWidth: '100vw' }}
                          >
                            <ModalHeader toggle={this.toggleModal}>
                              {this.state.modal.mode === 'create'
                                ? 'Thêm banner'
                                : 'Chỉnh sửa banner'}
                            </ModalHeader>
                            <ModalBody>
                              <ManagementModal
                                mode={this.state.modal.mode}
                                closeModal={this.toggleModal}
                                refresh={refetch}
                                bannerData={this.state.modal.bannerData}
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
