const generateQueryString = (q: any) => {
  let queryString = "";
  if (q && !isEmptyObject(q)) {
    queryString += "?";
    const queryKeys = Object.keys(q);
    queryKeys.forEach(key => {
      if (q[key]) {
        if (q[key].toString().length) {
          queryString += `${key}=${q[key]}&`;
        }
      }
    });
    if (queryKeys.length > 0 && queryString[queryString.length - 1] === '&') {
      queryString = queryString.slice(0, -1);
    }
  }
  return queryString;
};

const convertObjectToFormData = (formData: FormData, data: string | Blob, parentKey?: string) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      convertObjectToFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey, value);
  }
}

const isEmptyObject = (object: Object) => {
  return Object.keys(object).length === 0;
}

const shortenObject = (object: Object, array: Array<any>) => {
  array.forEach(function(key) {
    delete object[key];
  });
  return object;
}

export  {generateQueryString, convertObjectToFormData, isEmptyObject, shortenObject};

