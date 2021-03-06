import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faStethoscope,
    faChartLine,
    faChartBar,
    faUser,
    faUnlockAlt,
    faEye,
    faEyeSlash,
    faHeartbeat,
    faCalendarCheck,
    faExclamationTriangle,
    faSave,
    faTimes,
    faBars,
    faExpandArrowsAlt,
    faSignOutAlt,
    faTh,
    faInfo,
    faInfoCircle,
    faLanguage,
    faTruck,
    faExternalLinkAlt,
    faPen, faFileAlt,
    faFilePdf,
    faUserFriends,
    faIdBadge,
    faCommentDots,
    faTasks,
    faEllipsisH,
    faDollarSign,
    faArrowsAltH,
    faMapMarker,
    faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faInfoCircle);
library.add(faInfo);
library.add(faTh);
library.add(faBars);
library.add(faExpandArrowsAlt);
library.add(faSignOutAlt);
library.add(faSave);
library.add(faTimes);
library.add(faExclamationTriangle);
library.add(faCalendarCheck);
library.add(faStethoscope);
library.add(faChartBar);
library.add(faChartLine);
library.add(faUser);
library.add(faUnlockAlt);
library.add(faEyeSlash);
library.add(faEye);
library.add(faHeartbeat);
library.add(faLanguage);
library.add(faTruck);
library.add(faExternalLinkAlt);
library.add(faPen);
library.add(faFileAlt);
library.add(faFilePdf);
library.add(faUserFriends);
library.add(faIdBadge);
library.add(faCommentDots);
library.add(faTasks);
library.add(faEllipsisH);
library.add(faDollarSign);
library.add(faArrowsAltH);
library.add(faMapMarker);
library.add(faMapMarkerAlt);

Vue.component("font-awesome-icon", FontAwesomeIcon);
