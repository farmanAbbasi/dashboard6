import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  redirectUri: window.location.origin + '/',
  clientId: '85a8e3f2-4529-4872-a38c-7362fb79ea52',
  scope: 'openid',
  responseType: 'code id_token',
  oidc: true,
  // customQueryParams: { prompt: 'consent' },
  silentRefreshShowIFrame: false,
  sessionCheckIFrameUrl:
    'https://login.microsoftonline.com/371cb917-b098-4303-b878-c182ec8403ac/oauth2/checksession',
  jwks: {
    keys: [
      {
        kty: 'RSA',
        use: 'sig',
        kid: 'FSimuFrFNoC0sJXGmv13nNZceDc',
        x5t: 'FSimuFrFNoC0sJXGmv13nNZceDc',
        n:
          'yCYaJF8uHoV2L31cjZUDdcodK1Y1EsTLkDD-DEXFyGeHaQ92T9t6MU6zazBzHvJRarG6OMI1GwsFxZ9opSVOeuRjuL3H2ehmUyuKOAnL' +
          '8uT4cfkdfbg9AIN_63COccfFn0br_xUszZ7lkF5mb63sze-G66YQcbdTCWgsXpxR6491b57Gc4HVTV8cEgU4byezhJIiirrPDmt23QJIjr6Xt' +
          'vUMSNW88u0kX7PKOUnVCns2AG8DB2I-JExTiXwhFVu5JUqgpgmjIngvd5eyNzOgFJMnpWNXabKDP3oMLvQxjdq9xwWuTu0IQLpmUxEF9jVc8v' +
          'KV1Pu2xHcS7ON5xJrUzw',
        e: 'AQAB',
        x5c: [
          'MIIDBTCCAe2gAwIBAgIQev76BWqjWZxChmKkGqoAfDANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb25' +
            '0cm9sLndpbmRvd3MubmV0MB4XDTE4MDIxODAwMDAwMFoXDTIwMDIxOTAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC' +
            '53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMgmGiRfLh6Fdi99XI2VA3XKHStWNRLEy5Aw/gxFxchnh2kPdk/be' +
            'jFOs2swcx7yUWqxujjCNRsLBcWfaKUlTnrkY7i9x9noZlMrijgJy/Lk+HH5HX24PQCDf+twjnHHxZ9G6/8VLM2e5ZBeZm+t7M3vhuumEHG3Uwlo' +
            'LF6cUeuPdW+exnOB1U1fHBIFOG8ns4SSIoq6zw5rdt0CSI6+l7b1DEjVvPLtJF+zyjlJ1Qp7NgBvAwdiPiRMU4l8IRVbuSVKoKYJoyJ4L3eXsjc' +
            'zoBSTJ6VjV2mygz96DC70MY3avccFrk7tCEC6ZlMRBfY1XPLyldT7tsR3EuzjecSa1M8CAwEAAaMhMB8wHQYDVR0OBBYEFIks1srixjpSLXeiR8' +
            'zES5cTY6fBMA0GCSqGSIb3DQEBCwUAA4IBAQCKthfK4C31DMuDyQZVS3F7+4Evld3hjiwqu2uGDK+qFZas/D/eDunxsFpiwqC01RIMFFN8yvmMj' +
            'HphLHiBHWxcBTS+tm7AhmAvWMdxO5lzJLS+UWAyPF5ICROe8Mu9iNJiO5JlCo0Wpui9RbB1C81Xhax1gWHK245ESL6k7YWvyMYWrGqr1NuQcNS0' +
            'B/AIT1Nsj1WY7efMJQOmnMHkPUTWryVZlthijYyd7P2Gz6rY5a81DAFqhDNJl2pGIAE6HWtSzeUEh3jCsHEkoglKfm4VrGJEuXcALmfCMbdfTvt' +
            'u4rlsaP2hQad+MG/KJFlenoTK34EMHeBPDCpqNDz8UVNk'
        ]
      },
      {
        kty: 'RSA',
        use: 'sig',
        kid: '2S4SCVGs8Sg9LS6AqLIq6DpW-g8',
        x5t: '2S4SCVGs8Sg9LS6AqLIq6DpW-g8',
        n:
          'oZ-QQrNuB4ei9ATYrT61ebPtvwwYWnsrTpp4ISSp6niZYb92XM0oUTNgqd_C1vGN8J-y9wCbaJWkpBf46CjdZehrqczPhzhHau8WcRXocSB1u' +
          '_tuZhv1ooAZ4bAcy79UkeLiG60HkuTNJJC8CfaTp1R97szBhuk0Vz5yt4r5SpfewIlBCnZUYwkDS172H9WapQu-3P2Qjh0l-JLyCkdrhvizZUk0atq' +
          '5_AIDKRU-A0pRGc-EZhUL0LqUMz6c6M2s_4GnQaScv44A5iZUDD15B6e8Apb2yARohkWmOnmRcTVfes8EkfxjzZEzm3cNkvP0ogILyISHKlkzy2Oml' +
          'U6iXw',
        e: 'AQAB',
        x5c: [
          'MIIDKDCCAhCgAwIBAgIQBHJvVNxP1oZO4HYKh+rypDANBgkqhkiG9w0BAQsFADAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXM' +
            'wHhcNMTYxMTE2MDgwMDAwWhcNMTgxMTE2MDgwMDAwWjAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXMwggEiMA0GCSqGSIb3DQEBAQUAA4' +
            'IBDwAwggEKAoIBAQChn5BCs24Hh6L0BNitPrV5s+2/DBhaeytOmnghJKnqeJlhv3ZczShRM2Cp38LW8Y3wn7L3AJtolaSkF/joKN1l6GupzM+HOEdq7xZxF' +
            'ehxIHW7+25mG/WigBnhsBzLv1SR4uIbrQeS5M0kkLwJ9pOnVH3uzMGG6TRXPnK3ivlKl97AiUEKdlRjCQNLXvYf1ZqlC77c/ZCOHSX4kvIKR2uG+LNlSTRq' +
            '2rn8AgMpFT4DSlEZz4RmFQvQupQzPpzozaz/gadBpJy/jgDmJlQMPXkHp7wClvbIBGiGRaY6eZFxNV96zwSR/GPNkTObdw2S8/SiAgvIhIcqWTPLY6aVTqJ' +
            'fAgMBAAGjWDBWMFQGA1UdAQRNMEuAEDUj0BrjP0RTbmoRPTRMY3WhJTAjMSEwHwYDVQQDExhsb2dpbi5taWNyb3NvZnRvbmxpbmUudXOCEARyb1TcT9aGTu' +
            'B2Cofq8qQwDQYJKoZIhvcNAQELBQADggEBAGnLhDHVz2gLDiu9L34V3ro/6xZDiSWhGyHcGqky7UlzQH3pT5so8iF5P0WzYqVtogPsyC2LPJYSTt2vmQugD' +
            '4xlu/wbvMFLcV0hmNoTKCF1QTVtEQiAiy0Aq+eoF7Al5fV1S3Sune0uQHimuUFHCmUuF190MLcHcdWnPAmzIc8fv7quRUUsExXmxSX2ktUYQXzqFyIOSnDC' +
            'uWFm6tpfK5JXS8fW5bpqTlrysXXz/OW/8NFGq/alfjrya4ojrOYLpunGriEtNPwK7hxj1AlCYEWaRHRXaUIW1ByoSff/6Y6+ZhXPUe0cDlNRt/qIz5aflwO' +
            '7+W8baTS4O8m/icu7ItE='
        ]
      }
    ]
  },
  loginUrl:
    'https://login.microsoftonline.com/371cb917-b098-4303-b878-c182ec8403ac/oauth2/authorize',
  tokenEndpoint:
    'https://login.microsoftonline.com/371cb917-b098-4303-b878-c182ec8403ac/oauth2/token',
  userinfoEndpoint:
    'https://login.microsoftonline.com/371cb917-b098-4303-b878-c182ec8403ac/openid/userinfo',
  issuer: 'https://sts.windows.net/371cb917-b098-4303-b878-c182ec8403ac/',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  strictDiscoveryDocumentValidation: false,
  resource: '00000003-0000-0000-c000-000000000000',
  logoutUrl:
    'https://login.microsoftonline.com/371cb917-b098-4303-b878-c182ec8403ac/oauth2/logout',
  sessionChecksEnabled: false
};
