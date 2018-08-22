import _ from 'lodash';

import { isOwnAddress } from '../../../helpers/address';

/* @ngInject */
function contactViewItem(contactEncryptionSettings, contactDetailsModel, keyCache, addressesModel) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: require('../../../templates/contact/contactViewItem.tpl.html'),
        link(scope) {
            scope.formatAddress = (list = []) => list.filter(Boolean);

            scope.isOwnAddress = (email) => {
                const address = addressesModel.getByEmail(email);
                const keys = keyCache.getUserAddressesKeys(address) || {};
                return isOwnAddress(address, keys);
            };

            scope.settings = async function advanced(item) {
                const model = await contactEncryptionSettings(
                    { ...item },
                    {
                        config: contactDetailsModel.extractAll(scope.contact.vCard),
                        contact: scope.contact,
                        index: 0
                    }
                ).catch(_.noop);

                // Ensure we sync the view
                scope.$applyAsync(() => {
                    item.settings = model;
                });
            };
        }
    };
}
export default contactViewItem;