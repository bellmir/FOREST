// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Logistics {
    struct Location {
        string locationType;
        string name;
        string xCor;
        string yCor;
        mapping(string => uint256) itemList; // 물품 목록 (itemName => quantity)
        string[] chargedUserUUIDs; // 권한이 있는 유저 UUID 목록
    }

    struct Deposit {
        string chargedUserUUID; // 물품 이동 요청자 (UUID)
        string confirmUserUUID; // 물품 이동 승인자 (UUID)
        uint256 sourceLocationId; // 출발 창고 ID
        uint256 destLocationId; // 도착 창고 ID
        mapping(string => uint256) items; // 이동할 물품 목록
        string[] itemNames; // 물품 이름 목록
        uint256 timestamp; // 요청 생성 시간
        string status; // 요청 상태 (예: "Pending", "Approved", "Rejected")
    }

    mapping(uint256 => Location) public locations; // 창고 목록
    mapping(uint256 => Deposit) public deposits; // 물품 이동 요청 목록

    uint256 public locationCount = 0; // 창고 ID를 위한 카운터
    uint256 public depositCount = 0; // 물품 이동 요청 ID를 위한 카운터

    event LocationCreated(uint256 locationId, string name);
    event DepositCreated(
        uint256 depositId,
        string chargedUserUUID,
        uint256 sourceLocationId,
        uint256 destLocationId
    );
    event DepositApproved(uint256 depositId, string confirmUserUUID);
    event DepositRejected(uint256 depositId, string confirmUserUUID);

    modifier onlyChargedUser(uint256 locationId, string memory userUUID) {
        bool hasAccess = false;
        for (
            uint256 i = 0;
            i < locations[locationId].chargedUserUUIDs.length;
            i++
        ) {
            if (
                keccak256(
                    abi.encodePacked(locations[locationId].chargedUserUUIDs[i])
                ) == keccak256(abi.encodePacked(userUUID))
            ) {
                hasAccess = true;
                break;
            }
        }
        require(
            hasAccess,
            "Access denied: Not a charged user of this location"
        );
        _;
    }

    function createLocation(
        string memory _type,
        string memory _name,
        string memory _xCor,
        string memory _yCor,
        string[] memory _chargedUserUUIDs
    ) public {
        locations[locationCount].locationType = _type;
        locations[locationCount].name = _name;
        locations[locationCount].xCor = _xCor;
        locations[locationCount].yCor = _yCor;
        locations[locationCount].chargedUserUUIDs = _chargedUserUUIDs;
        emit LocationCreated(locationCount, _name);
        locationCount++;
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

        deposits[depositCount].chargedUserUUID = _chargedUserUUID;
        deposits[depositCount].sourceLocationId = _sourceLocationId;
        deposits[depositCount].destLocationId = _destLocationId;
        deposits[depositCount].timestamp = block.timestamp;
        deposits[depositCount].status = "Pending";
        deposits[depositCount].itemNames = _itemNames; // 물품 이름 저장

        for (uint256 i = 0; i < _itemNames.length; i++) {
            require(
                locations[_sourceLocationId].itemList[_itemNames[i]] >=
                    _itemQuantities[i],
                "Insufficient items in source location"
            );
            deposits[depositCount].items[_itemNames[i]] = _itemQuantities[i];
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
    {
        require(
            keccak256(abi.encodePacked(deposits[_depositId].status)) ==
                keccak256(abi.encodePacked("Pending")),
            "Deposit is not pending"
        );

        deposits[_depositId].status = "Approved";
        deposits[_depositId].confirmUserUUID = _confirmUserUUID;

        // 실제로 물품 이동
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

        emit DepositApproved(_depositId, _confirmUserUUID);
    }

    function rejectDeposit(
        uint256 _depositId,
        string memory _confirmUserUUID
    )
        public
        onlyChargedUser(deposits[_depositId].destLocationId, _confirmUserUUID)
    {
        require(
            keccak256(abi.encodePacked(deposits[_depositId].status)) ==
                keccak256(abi.encodePacked("Pending")),
            "Deposit is not pending"
        );

        deposits[_depositId].status = "Rejected";
        deposits[_depositId].confirmUserUUID = _confirmUserUUID;

        emit DepositRejected(_depositId, _confirmUserUUID);
    }

    // Helper function to get item names for a specific deposit
    function getItemNamesForDeposit(
        uint256 _depositId
    ) internal view returns (string[] memory) {
        return deposits[_depositId].itemNames;
    }

    // 조회용 함수
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
            string[] memory
        )
    {
        Location storage location = locations[_locationId];
        return (
            location.locationType,
            location.name,
            location.xCor,
            location.yCor,
            location.chargedUserUUIDs
        );
    }

    // 조회용 함수
    function getDeposit(
        uint256 _depositId
    )
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            string[] memory,
            uint256,
            string memory
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

    function updateItemQuantity(
        uint256 _locationId,
        string memory _itemName,
        uint256 _quantity
    ) public {
        locations[_locationId].itemList[_itemName] = _quantity;
    }
}
