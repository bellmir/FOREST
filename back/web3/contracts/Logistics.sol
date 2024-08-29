// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract Logistics is ReentrancyGuardUpgradeable {
    struct Location {
        string locationType;
        string name;
        string xCor;
        string yCor;
        mapping(string => uint256) itemList;
        string[] itemNames;
        mapping(string => bool) authorizedUsers; // 접근 제어 최적화
        string[] userList; // 접근 권한이 있는 유저들의 UUID 목록
    }

    enum DepositStatus {
        Pending,
        Approved,
        Rejected
    } // 상태를 enum으로 정의

    struct Deposit {
        string chargedUserUUID;
        string confirmUserUUID;
        uint256 sourceLocationId;
        uint256 destLocationId;
        mapping(string => uint256) items;
        string[] itemNames;
        uint256 timestamp;
        DepositStatus status;
    }

    mapping(uint256 => Location) public locations;
    mapping(uint256 => Deposit) public deposits;
    uint256 public locationCount = 0;
    uint256 public depositCount = 0;

    event LocationCreated(uint256 locationId, string name);
    event DepositCreated(
        uint256 depositId,
        string chargedUserUUID,
        uint256 sourceLocationId,
        uint256 destLocationId
    );
    event DepositApproved(uint256 depositId, string confirmUserUUID);
    event DepositRejected(uint256 depositId, string confirmUserUUID);
    event ItemQuantityUpdated(
        uint256 locationId,
        string itemName,
        uint256 quantity
    ); // 물품 수량 업데이트 이벤트
    event UserAuthorized(uint256 locationId, string userUUID); // 새로운 유저 추가 이벤트

    modifier onlyChargedUser(uint256 locationId, string memory userUUID) {
        require(
            locations[locationId].authorizedUsers[userUUID],
            "Access denied: Not a charged user of this location"
        );
        _;
    }

    function initialize() public initializer {
        __ReentrancyGuard_init(); // Initialize the ReentrancyGuardUpgradeable
        // You may add other initialization logic here if needed in the future
    }

    function createLocation(
        string memory _type,
        string memory _name,
        string memory _xCor,
        string memory _yCor,
        string[] memory _chargedUserUUIDs,
        string[] memory itemNames, // Array of item names
        uint256[] memory itemAmounts // Array of corresponding item amounts
    ) public {
        require(bytes(_name).length > 0, "Location name cannot be empty");
        require(
            bytes(_xCor).length > 0 && bytes(_yCor).length > 0,
            "Coordinates cannot be empty"
        );
        require(
            !isLocationDuplicate(_name, _xCor, _yCor),
            "Location already exists"
        );
        require(
            itemNames.length == itemAmounts.length,
            "Items and amounts length mismatch"
        );

        Location storage newLocation = locations[locationCount];
        newLocation.locationType = _type;
        newLocation.name = _name;
        newLocation.xCor = _xCor;
        newLocation.yCor = _yCor;

        for (uint256 i = 0; i < _chargedUserUUIDs.length; i++) {
            newLocation.authorizedUsers[_chargedUserUUIDs[i]] = true;
            newLocation.userList.push(_chargedUserUUIDs[i]);
        }

        // Add items to the itemList
        for (uint256 j = 0; j < itemNames.length; j++) {
            newLocation.itemList[itemNames[j]] = itemAmounts[j];
            newLocation.itemNames.push(itemNames[j]);
        }

        emit LocationCreated(locationCount, _name);
        locationCount++;
    }

    function isLocationDuplicate(
        string memory _name,
        string memory _xCor,
        string memory _yCor
    ) internal view returns (bool) {
        for (uint256 i = 0; i < locationCount; i++) {
            if (
                keccak256(abi.encodePacked(locations[i].name)) ==
                keccak256(abi.encodePacked(_name)) ||
                (keccak256(abi.encodePacked(locations[i].xCor)) ==
                    keccak256(abi.encodePacked(_xCor)) &&
                    keccak256(abi.encodePacked(locations[i].yCor)) ==
                    keccak256(abi.encodePacked(_yCor)))
            ) {
                return true;
            }
        }
        return false;
    }

    function addChargedUser(
        uint256 _locationId,
        string memory _userUUID
    ) public onlyChargedUser(_locationId, _userUUID) {
        require(
            !locations[_locationId].authorizedUsers[_userUUID],
            "User already authorized"
        );
        locations[_locationId].authorizedUsers[_userUUID] = true;
        locations[_locationId].userList.push(_userUUID);

        emit UserAuthorized(_locationId, _userUUID);
    }

    function createDeposit(
        uint256 _sourceLocationId,
        uint256 _destLocationId,
        string memory _chargedUserUUID,
        string[] memory _itemNames,
        uint256[] memory _itemQuantities
    ) public onlyChargedUser(_sourceLocationId, _chargedUserUUID) {
        require(
            _itemNames.length == _itemQuantities.length,
            "Items and quantities length mismatch"
        );

        Deposit storage newDeposit = deposits[depositCount];
        newDeposit.chargedUserUUID = _chargedUserUUID;
        newDeposit.sourceLocationId = _sourceLocationId;
        newDeposit.destLocationId = _destLocationId;
        newDeposit.timestamp = block.timestamp;
        newDeposit.status = DepositStatus.Pending;
        newDeposit.itemNames = _itemNames;

        for (uint256 i = 0; i < _itemNames.length; i++) {
            require(
                locations[_sourceLocationId].itemList[_itemNames[i]] >=
                    _itemQuantities[i],
                "Insufficient items in source location"
            );
            newDeposit.items[_itemNames[i]] = _itemQuantities[i];
        }

        emit DepositCreated(
            depositCount,
            _chargedUserUUID,
            _sourceLocationId,
            _destLocationId
        );
        depositCount++;
    }

    function approveDeposit(
        uint256 _depositId,
        string memory _confirmUserUUID
    )
        public
        onlyChargedUser(deposits[_depositId].destLocationId, _confirmUserUUID)
        nonReentrant
    {
        require(
            deposits[_depositId].status == DepositStatus.Pending,
            "Deposit is not pending"
        );

        _updateDepositStatus(
            _depositId,
            DepositStatus.Approved,
            _confirmUserUUID
        );
        _moveItems(_depositId);

        emit DepositApproved(_depositId, _confirmUserUUID);
    }

    function rejectDeposit(
        uint256 _depositId,
        string memory _confirmUserUUID
    )
        public
        onlyChargedUser(deposits[_depositId].destLocationId, _confirmUserUUID)
        nonReentrant
    {
        require(
            deposits[_depositId].status == DepositStatus.Pending,
            "Deposit is not pending"
        );

        _updateDepositStatus(
            _depositId,
            DepositStatus.Rejected,
            _confirmUserUUID
        );
        emit DepositRejected(_depositId, _confirmUserUUID);
    }

    function _updateDepositStatus(
        uint256 _depositId,
        DepositStatus _status,
        string memory _confirmUserUUID
    ) internal {
        deposits[_depositId].status = _status;
        deposits[_depositId].confirmUserUUID = _confirmUserUUID;
    }

    function _moveItems(uint256 _depositId) internal {
        string[] memory itemNames = getItemNamesForDeposit(_depositId);
        for (uint256 i = 0; i < itemNames.length; i++) {
            string memory itemName = itemNames[i];
            uint256 quantity = deposits[_depositId].items[itemName];
            locations[deposits[_depositId].sourceLocationId].itemList[
                    itemName
                ] -= quantity;
            locations[deposits[_depositId].destLocationId].itemList[
                    itemName
                ] += quantity;
        }
    }

    function getItemNamesForDeposit(
        uint256 _depositId
    ) internal view returns (string[] memory) {
        return deposits[_depositId].itemNames;
    }

    function getLocation(
        uint256 _locationId
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string[] memory,
            string[] memory, // Array of item names
            uint256[] memory // Array of item amounts
        )
    {
        Location storage location = locations[_locationId];

        // Prepare arrays to return the item names and amounts
        uint256 itemCount = location.userList.length; // Determine the number of items
        string[] memory itemNames = new string[](itemCount);
        uint256[] memory itemAmounts = new uint256[](itemCount);

        // Populate the arrays from the itemList mapping
        for (uint256 i = 0; i < itemCount; i++) {
            itemNames[i] = location.itemNames[i];
            itemAmounts[i] = location.itemList[location.userList[i]];
        }

        return (
            location.locationType,
            location.name,
            location.xCor,
            location.yCor,
            location.userList,
            itemNames,
            itemAmounts
        );
    }

    function getDeposit(
        uint256 _depositId
    )
        public
        view
        returns (
            string memory, // chargedUserUUID
            string memory, // confirmUserUUID
            uint256, // sourceLocationId
            uint256, // destLocationId
            string[] memory, // itemNames
            uint256, // timestamp
            DepositStatus // status
        )
    {
        Deposit storage deposit = deposits[_depositId];
        return (
            deposit.chargedUserUUID,
            deposit.confirmUserUUID,
            deposit.sourceLocationId,
            deposit.destLocationId,
            deposit.itemNames,
            deposit.timestamp,
            deposit.status
        );
    }

    function getItemListForLocation(
        uint256 _locationId
    ) public view returns (string[] memory, uint256[] memory) {
        Location storage location = locations[_locationId];
        string[] memory itemNames = new string[](location.userList.length);
        uint256[] memory itemQuantities = new uint256[](
            location.userList.length
        );
        uint256 index = 0;

        for (uint256 i = 0; i < location.userList.length; i++) {
            string memory userUUID = location.userList[i];
            if (location.itemList[userUUID] > 0) {
                itemNames[index] = userUUID;
                itemQuantities[index] = location.itemList[userUUID];
                index++;
            }
        }

        return (itemNames, itemQuantities);
    }

    function updateItemQuantity(
        uint256 _locationId,
        string memory _itemName,
        uint256 _quantity
    ) public onlyChargedUser(_locationId, _itemName) {
        locations[_locationId].itemList[_itemName] = _quantity;
        emit ItemQuantityUpdated(_locationId, _itemName, _quantity);
    }
}
