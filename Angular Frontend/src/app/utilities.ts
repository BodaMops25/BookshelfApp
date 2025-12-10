export function checkFormDataProps(propsArr: string[], formData: FormData) {
  const data: {[key: string]: string} = {};

    for(const prop of propsArr) {
      const field = formData.get(prop)

      if(
        field === null ||
        typeof field !== 'string' ||
        field === ''
      ) return

      data[prop] = field
    }

    return data
}

export type AlertTypes = 'success' | 'warning' | 'danger'

export function makeAlert(message: string, type: AlertTypes) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="alert alert-${type} alert-dismissible position-fixed" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `)
}