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

analyiseDataAndOpenInBrowser = (data) => {
    if (typeof data === 'string') {
            try {
                let parsedData = JSON.parse(data)
                let url = (parsedData.repository && parsedData.repository.url) || ''
                url = ((url && url.startsWith('git+')) ? url.split("git+").pop() : url) || 'https://www.npmjs.com/package/' + parsedData.name
                opn(url)
            } catch (error) {
                logIt({'error':true, 'message': 'Could not find Module'})
            }
        
        // logIt({'error':true, 'message': data})
    } else {
        logIt({'error': false, 'message': 'Failed to get Data. Try again.'})
    }
}

run()
