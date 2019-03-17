import React, { memo } from 'react';
import { FOOTER_ITEM } from 'constants/index';

function DefaultFooter() {
  return (
    <footer className="footer">
      <div className="footer-line">
        <ul className="footer-list">
          {FOOTER_ITEM.map((item, index) => (
            <li key={index} className="footer-list__item">
              <a href="/" className="footer-list__item__link">
                {item.value}
              </a>
            </li>
          ))}
        </ul>
        <span className="footer__copyright">
          &#169; 2018 - Bản quyền của công ty Cổ phần Thiên Hà Sáng Tạo
        </span>
        <span className="footer__description">
          Giấy chứng nhận Đăng ký Kinh doanh số 0315018642 do Sở Kế hoạch và Đầu
          tư Thành phố Hồ Chí Minh cấp ngày 28/04/2018.
        </span>
        <span className="footer__description">
          Đang chờ cấp Giấy phép mạng xã hội.
        </span>
      </div>
    </footer>
  );
}

export default memo(DefaultFooter);
