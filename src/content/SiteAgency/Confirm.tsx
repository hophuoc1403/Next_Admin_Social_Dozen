import {Box, Typography} from "@mui/material";

const Confirm = () => {
  return <Box p={3} sx={{border: "1px solid #655e53",borderRadius:"10px"}}>
    <ol>
      <li>
        <Typography variant={"body2"}>Tài khoản của bạn ở <strong>SITE CHÍNH</strong> sẽ là tài khoản admin ở site con
          (cùng tài khoản và mật khẩu)</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Tài khoản ở site con thì không để đăng nhập ở <strong>SITE CHÍNH</strong> và ngược
          lại</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Khi thanh toán ở site con thì tiền sẽ trừ thẳng vào tài khoản admin. Tất nhiên là
          trừ thêm tiền của khách. Vì thế để duy trì site hãy luôn để ý số dư thường xuyên.</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Khi tạo mới site con thì sẽ không có các cấp tài khoản (đại lý 1, đại lý 2). Admin
          ở site con hãy tự tạo cho site mình.</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Admin site con có thể set giá cho dịch vụ tuỳ vào mục đích.</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Chỉ có bạn là admin của site mình, không thể thêm hoặc xoá bớt admin, Hãy bảo vệ
          tài khoản thận trọng.</Typography>
      </li>
      <li>
        <Typography variant={"body2"}>Chỉ có thể tạo 1 site con duy nhất, nếu bạn muốn thay đổi hãy liên hệ
          admin</Typography>
      </li>

    </ol>
  </Box>
}

export default Confirm