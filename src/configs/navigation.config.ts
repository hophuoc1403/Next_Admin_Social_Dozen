import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import {
  PriceChangeOutlined,
  ManageAccountsRounded
} from '@mui/icons-material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import {ROLES} from "@/configs/auth.config";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CandlestickChartRoundedIcon from '@mui/icons-material/CandlestickChartRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LanIcon from '@mui/icons-material/Lan';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import DnsIcon from '@mui/icons-material/Dns';



export const adminNavigations = [
  {
    subheader: 'admin',
    key: 'admin',
    label: 'Admin',
    icon: CandlestickChartRoundedIcon,
    children: [
      // {
      //   key: 'product-site',
      //   label: 'Product site',
      //   href: '/admin/manage/ac',
      //   icon: Inventory2RoundedIcon
      // },
      {
        key: 'account',
        label: 'Accounts',
        href: '/admin/manage/account',
        icon: AccountBoxIcon
      },
      {
        key: 'site',
        href: '/admin/manage/reported-post',
        label: 'Reported posts',
        icon: LanIcon
      },
      {
        key: 'order',
        href: '/admin/manage/tags',
        label: 'Tags',
        icon: HomeRepairServiceIcon
      },
      {
        key: 'manage-product',
        href: "/admin/manage/post",
        label: 'Posts',
        icon: DnsIcon,
      }
    ]
  },

]
