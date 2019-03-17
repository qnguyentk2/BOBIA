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
import ReviewChapterModal from './ReviewChapterModal';
import ReviewFilter from './ReviewFilter';

export default class ReviewChapter extends Component {
  constructor(props) {
    super(props);

    this.refetch = null;

    this.state = {
      variables: {
        limit: 10,
        page: 1,
        filters: {
          state: ''
        }
      },
      modal: {
        active: false,
        reviewData: {}
      }
    };
  }

  approveChapter(id) {
    const {
      client,
      commonProps: {
        queries: { mutation },
        notify
      }
    } = Common;

    client
      .mutate({
        mutation: mutation.approveChapter,
        variables: {
          id
        }
      })
      .then(({ data }) => {
        if (
          data &&
          data.approveChapter &&
          data.approveChapter.success === true
        ) {
          notify.success('Thông qua thành công!');
          this.refetch();
        }
      });
  }

  filter = type => event => {
    this.setState({
      variables: {
        filters: {
          [`${type}`]: event.target.value === 'ALL' ? '' : event.target.value
        }
      }
    });
  };

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
      dataField: 'book.title',
      text: 'Tựa đề Sách'
    },
    {
      dataField: 'title',
      text: 'Tựa đề chương'
    },
    {
      dataField: 'state',
      text: 'Tình trạng',
      headerFormatter: (column, colIndex) => (
        <select
          className="form-control"
          onChange={this.filter('state')}
          value={
            this.state.variables.filters
              ? this.state.variables.filters.state
              : 'ALL'
          }
        >
          <option value="ALL">Tình Trạng</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="PENDING">Đang chờ duyệt</option>
          <option value="PUBLISHED">Đã thông qua</option>
          <option value="REFUSED">Không thông qua</option>
        </select>
      ),
      formatter: (cell, row, rowIndex) => {
        let currentState;
        switch (cell) {
          case 'DRAFT':
            currentState = 'Bản nháp';
            break;
          case 'PENDING':
            currentState = 'Đang chờ duyệt';
            break;
          case 'PUBLISHED':
            currentState = 'Đã thông qua';
            break;
          case 'REFUSED':
            currentState = 'Không thông qua';
            break;
          default:
            currentState = 'Bản nháp';
            break;
        }
        return currentState;
      }
    },
    {
      dataField: '',
      text: 'Thao tác',
      align: 'center',
      headerAlign: 'center',
      formatter: (cell, row) => {
        const BtnApprove = () => (
          <Button
            outline
            color="success"
            size="sm"
            onClick={async () => {
              const confirmResult = await this.props.commonComps.CommonConfirm({
                message: 'Bạn chắc chắn muốn thông qua tác phẩm này?',
                confirmText: 'Thông qua',
                confirmColor: 'primary',
                cancelText: 'Không',
                cancelColor: 'danger'
              });
              confirmResult && this.approveChapter(row.id);
            }}
          >
            <i className="fa fa-thumbs-up" /> Thông qua
          </Button>
        );

        const BtnRefuse = () => (
          <Button
            outline
            color="danger"
            size="sm"
            onClick={() => this.toggleModal(row)}
          >
            <i className="fa fa-thumbs-down" /> Không thông qua
          </Button>
        );

        const BtnUpdateRefused = () => (
          <Button
            outline
            color="danger"
            size="sm"
            onClick={() => this.toggleModal(row)}
          >
            <i className="fa fa-edit" /> Cập nhật lý do
          </Button>
        );

        if (row.isDel === true || row.state === 'DRAFT') {
          return '';
        }

        if (row.state === 'PENDING') {
          return (
            <ButtonGroup size="sm">
              <BtnApprove />
              <BtnRefuse />
            </ButtonGroup>
          );
        }

        if (row.state === 'PUBLISHED') {
          return <BtnRefuse />;
        }

        if (row.state === 'REFUSED') {
          return (
            <ButtonGroup size="sm">
              <BtnApprove />
              <BtnUpdateRefused />
            </ButtonGroup>
          );
        }
      }
    }
  ];

  toggleModal = (row = {}) => {
    this.setState({
      modal: {
        active: !this.state.modal.active,
        reviewData: {
          id: row.id,
          refusedReason: row.refusedReason
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
                Danh sách chương chờ kiểm duyệt
                {/* <Button
            outline
            color="primary"
            className="float-right"
            onClick={() => this.toggleModal('create')}
          >
            <i className="fa fa-plus" /> Thêm tag
          </Button> */}
              </CardHeader>
              <ReviewFilter />
              <CardBody>
                <Query
                  query={query.getAllChapters}
                  variables={{
                    orderBy: 'state',
                    options: { ...this.state.variables }
                  }}
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
                      data.getAllChapters &&
                      data.getAllChapters.success === true
                    ) {
                      return (
                        <React.Fragment>
                          <BootstrapTable
                            bootstrap4
                            striped
                            hover
                            keyField="id"
                            data={data.getAllChapters.chapters.docs}
                            columns={this.columnOptions}
                          />
                          <CommonPagination
                            currentPage={this.state.variables.page - 1}
                            totalPage={data.getAllChapters.chapters.pages}
                            itemPerPage={this.state.variables.limit}
                            onPageChange={pageNumber =>
                              this.handlePageChange(pageNumber.selected + 1)
                            }
                          />
                          <Modal
                            isOpen={this.state.modal.active}
                            toggle={this.toggleModal}
                            className={`modal-lg modal-danger ${
                              this.props.className
                            }`}
                          >
                            <ModalHeader toggle={this.toggleModal}>
                              Lý do không thông qua
                            </ModalHeader>
                            <ModalBody>
                              <ReviewChapterModal
                                closeModal={this.toggleModal}
                                refresh={refetch}
                                reviewData={this.state.modal.reviewData}
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
