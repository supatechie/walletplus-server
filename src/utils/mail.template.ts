import mjmlUtils from 'mjml-utils'
import * as path from 'path'

const registerMailPath = path.join(__dirname, '../public/mail-templates/register.html')

export const registerMailTemplate = async(data: { title: string; message: string; user: any; btnLink: string; btnText: string }) =>{
    return await mjmlUtils.inject(registerMailPath,data)
}

