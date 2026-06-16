// async function requestNotificationPermission() {
//   const permission = await Notification.requestPermission();
//   if (permission === 'granted') {
//     console.log('Notification permission granted.');
//   } else {
//     console.warn('Notification permission denied.');
//   }
// }

Console.write("[notifications.js] reached\n");

class PushTools {
    static tryauthonclick = true;
    static clickhandle(){
        if(this.tryauthonclick){
            this.requestNotificationPermission();
        }
    }
    static async requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            this.tryauthonclick = false;
            Console.write('Notification permission granted.');
        } else {
            Console.write_error('Notification permission denied.');
        }
    }
    static dbgpush() {
        if (Notification.permission === 'granted') {
            console.log(new Notification('Main Text', {
                body: 'Body Text',
                //icon: '/images/icon-192x192.png'
            }));
        }
    }
}