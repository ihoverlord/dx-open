#! /usr/bin/env node
const opn = require('opn')
const program = require('commander')
const request = require('request')

run = () => {
    program
        .version('0.1.0')
        .option('-o, --open [module]', 'Enter the module name you want to open')
        .parse(process.argv);
        
        logIt({'error':false, 'message': 'Searching for '+program.open+'......'})
       
        if (program.open) {
            getData(program.open)
        }
}

logIt = (obj) => {
    console.log('')
    if (obj === Object(obj)) {
        if (obj.error) {
            console.log('Something Came up')
            console.log('')
            console.log(obj.message)
            console.log('')
        } else {
            console.log(obj.message)
        }
    } else {
        console.log('Internal Error occured. Try again.')
    }
    console.log('')
}

getURL = (input) => {
    let mod = input.trim()
    return 'http://registry.npmjs.com/'+mod+'/latest'
}

getData = async (input) => {
    const url = await getURL(input)
    request(url, (error, response, body) => {
        if(error) logIt({'error':true, 'message': 'Failed to get Data. Try again.'})
        else analyiseDataAndOpenInBrowser(body)
    });
}

filterData = (data) => {
    try {
        let parsedData = JSON.parse(data)
        let url = (parsedData.repository && parsedData.repository.url) || 'https://www.npmjs.com/package/' + parsedData.name
        if (url.startsWith('git+')) url = url.split("git+").pop()
        if (url.endsWith('.git')) url = url.split(".git").shift()
        if (url.startsWith('git@')) {
            url = url.split("git@").pop()
            url = 'https://' + url
        }
        if (url.indexOf('.com:') > 0) {
            url = url.replace(/.com:/i,".com/")
        }
        return url
    } catch (error) {
        logIt({'error':true, 'message': 'Could not find Module'})
    }
}

opnUrl = (url) => {
    try {
        console.log('Opening url : ' + url)
        opn(url)
    } catch (error) {
        logIt({'error': true, 'message': 'Could not open the webpage. Try again later.'})
    }
}

analyiseDataAndOpenInBrowser = (data) => {
    if (typeof data === 'string') {
            try {
                const url = filterData(data)
                opnUrl(url)
            } catch (error) {
                logIt({'error':true, 'message': 'Could not find Module'})
            }
        
        // logIt({'error':true, 'message': data})
    } else {
        logIt({'error': false, 'message': 'Failed to get Data. Try again.'})
    }
}

run()
