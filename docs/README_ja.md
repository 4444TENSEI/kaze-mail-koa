[英文](https://github.com/4444TENSEI/kaze-mail/blob/main/docs/README_en.md) | [Chinese](https://github.com/4444TENSEI/kaze-mail/blob/main/README.md) | 日本語

> ## Interface online address

URL: https://kaze-mail.uc1.icu/push?to=YourEmail&name=kaze&title=Hi&msg=Meow

>  Replace YourEmail in the URL above with your receiving email address, and open it in the browser to receive the test email.
>
>  static site will not cause security issues such as data leakage. This can be confirmed in the F12 Network tab.

Both GET and POST methods are supported, interface request routing: `/push`

| Is it necessary | Parameters | Description |
| -------- | :---- | ---------------- |
| Required | to | Recipient email address |
| Optional | msg | Email text |
| Optional | title | Email title |
| Optional | name | Custom sender nickname |

> ## One-click self-deployment to: Vercel

1. Register [Vercel](https://vercel.com/signup) account

2. Click this button👉[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/4444TENSEI/kaze-mail)
3. In the `Private Repository Name`**input box**, enter a custom name
4. Select a suitable location in the `Vercel Team`** drop-down box**
5. Click the `Create` button and wait for the deployment to complete
6.  Enter the Vercel configuration panel (`settings`→`environment-variables`) page, set the 4 information you obtained from the SMTP service provider, and set the following 4 corresponding environment variables as values: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

*Optional: Set the interface to your own domain name on the `settings`→`domains` page under the Vercel project*