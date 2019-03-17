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
import CategoryFilter from './CategoryFilter';

export default class CategoryManagement extends Component {
  constructor(props) {
    super(props);

    this.refetch = null;

    this.state = {
      variables: {
        limit: 10,
        page: 1
      },
      filters: {
        isDel: true,
        name: ''
      },
      filtersType: 'AND',
      modal: {
        active: false,
        mode: '',
        categoryData: {}
      }
    };
  }

  deleteCategory(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.deleteCategory,
        variables: {
          categoryId: id
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.deleteCategory &&
          data.deleteCategory.success === true
        ) {
          notify.success('Xoá category thành công!');
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
      text: 'Tên category'
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
          return (
            <Button
              outline
              color="success"
              onClick={() => this.toggleModal('active', row)}
            >
              <i className="fa fa-edit" /> Active
            </Button>
          );
        }
        const { commonComps } = Common;

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
                const confirmResult = await commonComps.CommonConfirm({
                  message: 'Bạn chắc chắn muốn deactive category này?',
                  confirmText: 'Có',
                  confirmColor: 'primary',
                  cancelText: 'Không',
                  cancelColor: 'danger'
                });
                confirmResult && this.deleteCategory(row.id);
              }}
            >
              <i className="fa fa-times" /> Deactive
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
        categoryData: {
          ...row
        }
      }
    });
  };

  handleFilterChange = ({ id, value, checked }) => {
    this.setState({
      filters: {
        name: id === 'categoryName' ? value : this.state.filters.name,
        isDel: id === 'isDel' ? checked : this.state.filters.isDel
      }
    });
  };

  // handleSearch = data => {
  //   console.log('data: ', data);
  // };

  renderModelMessage = ({ mode }) => {
    if (mode === 'create') {
      return 'Thêm category';
    } else if (mode === 'update') {
      return 'Chỉnh sửa category';
    } else if (mode === 'active') {
      return 'Active this category';
    }

    return '';
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
      // CommonLoading
      commonComps: { CommonRedirect, CommonPagination, Page500 }
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
                Quản lý category
                <Button
                  outline
                  color="primary"
                  className="float-right"
                  onClick={() => this.toggleModal('create')}
                >
                  <i className="fa fa-plus" /> Thêm category
                </Button>
              </CardHeader>
              <CategoryFilter
                dataFilter={this.state.filters}
                onSearchCategory={this.handleSearch}
                onFilterChange={this.handleFilterChange}
              />
              <CardBody>
                <Query
                  query={query.getAllCategories}
                  variables={{
                    options: { ...this.state.variables },
                    filters: { ...this.state.filters },
                    filtersType: this.state.filtersType
                  }}
                >
                  {({ loading, error, data, refetch }) => {
                    this.refetch = refetch;

                    if (loading) {
                      // return <CommonLoading />;
                      return <div />;
                    }
                    if (error && error.networkError) {
                      return <Page500 />;
                    }
                    if (
                      data &&
                      data.getAllCategories &&
                      data.getAllCategories.success === true
                    ) {
                      return (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            striped
                            hover
                            keyField="id"
                            data={data.getAllCategories.categories.docs}
                            columns={this.columnOptions}
                          />
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={data.getAllCategories.categories.pages}
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
                              {this.renderModelMessage(this.state.modal)}
                              {/* {this.state.modal.mode === 'create'
                                ? 'Thêm category'
                                : 'Chỉnh sửa category'} */}
                            </ModalHeader>
                            <ModalBody>
                              <ManagementModal
                                mode={this.state.modal.mode}
                                closeModal={this.toggleModal}
                                refresh={refetch}
                                categoryData={this.state.modal.categoryData}
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
