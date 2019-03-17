import React, { memo } from 'react';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'constants/index';

function UserProfileInfo(props) {
  const { user } = props;

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <label>Bút danh</label>
        </div>
        <div className="col-md-6">
          <p>{user.displayName}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Biệt danh</label>
        </div>
        <div className="col-md-6">
          <p>{user.nickname || 'Không có'}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Thư điện tử</label>
        </div>
        <div className="col-md-6">
          <p>{user.email || 'Không có'}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Số điện thoại</label>
        </div>
        <div className="col-md-6">
          <p>{user.phoneNumber || 'Không có'}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Địa chỉ</label>
        </div>
        <div className="col-md-6">
          <p>{user.address || 'Không có'}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Ngày sinh</label>
        </div>
        <div className="col-md-6">
          <p>
            {moment(user.birthDate).format(DATE_TIME_FORMAT.DEFAULT_FORMAT) ||
              'Không có'}
          </p>
        </div>
      </div>
    </>
  );
}

export default memo(UserProfileInfo);
