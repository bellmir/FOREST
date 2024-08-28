export type CommonResType<DataType = any, ErrorDataType = any> =
	| {
			success: false;
			error: {
				code: string;
				response: string;
				message: string;
			};
			data?: ErrorDataType;
	  }
	| {
			success: true;
			data: DataType;
	  };
