/*
For all functions that require a callback, the callback will be of the form callback(err, response), 
where err is an error message, if any, and response is a response message, if any. 
These will be in JSON format. See the Bluemix Retrieve and Rank API for response examples.
*/

/*
Constructor for the RNRService object. 
Requires an initialized watson object (i.e. var watson = require('watson-developer-cloud'))
and username and password for an existing Retrieve and Rank (RNR) service.
*/
var RNRService = function(watson, username, password) {

    this.watson = watson;
    this.rnr = watson.retrieve_and_rank({
        username: username,
        password: password,
        version: 'v1'
    });

};

/*
Creates a new Solr cluster for use with RNR. 
Requires the cluster size (can be an int from 1 to 7. 1 is a small free cluster size), the name of the cluster, 
and a callback to handle the error and response messages.
*/
RNRService.prototype.createCluster = function(clusterSize, clusterName, callback) {

    var params = {
        cluster_size: clusterSize,
        cluster_name: clusterName
    };

    this.rnr.createCluster(params, callback);

}

/*
List the current Solr clusters on the RNR instance and information about them. 
Requires a callback to handle the error and response messages.
*/
RNRService.prototype.listClusters = function(callback) {

    this.rnr.listClusters({}, callback);

}

/*
Polls a certaina cluster for information specific to it. Useful for seeing if a cluster is ready to be used or not.
Requires the cluster id of the cluster and a callback to handle the error and response messages.
*/
RNRService.prototype.pollCluster = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.pollCluster(params, callback);

}

/*
Deletes a given Solr cluster from the RNR instance.
Requires the cluster id of the cluster and a call back to handle the error and response messages.
*/
RNRService.prototype.deleteCluster = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.deleteCluster(params, callback);

}

/*
Uploads a configuration file to a Solr cluster on the RNR instance.
Requires the cluster id of the cluster, the name of the configuration you want to create,
a path to the local zip file that contains the Solr configuration, and a callback to handle the error and response messages.
*/
RNRService.prototype.uploadConfig = function(clusterId, configName, configZipPath, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName,
        config_zip_path: configZipPath
    };

    this.rnr.uploadConfig(params, callback);

}

/*
Lists the currently available Solr configurations on a given Solr cluster on the RNR instance.
Requires the cluster id of the cluster and a callback to handle the error and response messages.
*/
RNRService.prototype.listConfigs = function(clusterId, callback) {

    var params = {
        cluster_id: clusterId
    };

    this.rnr.listConfigs(params, callback);

}

/*
Gets Solr configuration from a Solr Configuration on the RNR instance.
Requires the cluster id of the cluster and the name of the configuration you want to retrieve.
Returns a zip file containing the cluster.
*/
RNRService.prototype.getConfig = function(clusterId, configName) {

    var params = {
        cluster_id: clusterId,
        config_name: configName
    };

    return this.rnr.getConfig(params);

}

/*
Deletes a Solr configuration on a Solr configuration on the RNR instance.
Requires the cluster id of the cluster, the name of the configuration you want to delete,
and a callback to handle the error and response messages.
*/
RNRService.prototype.deleteConfig = function(clusterId, configName, callback) {

    var params = {
        cluster_id: clusterId,
        config_name: configName
    };

    this.rnr.deleteConfig(params, callback);

}

/*
Creates a new Solr collection on a Solr cluster on the RNR instance.
Requires the cluster id of the cluster, the name of the collection you want to create,
and a callback to handle the error and response messages.
*/
RNRService.prototype.createCollection = function(clusterId, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        collection_name: collectionName
    };

    this.rnr.createCollection(params, callback);

}

/*
Deletes a Solr collection on a Solr cluster on the RNR instance.
Requires the cluster id of the cluster, the name of the collection you want to delete,
and a callback to handle the error and response messages.
*/
RNRService.prototype.deleteCollection = function(clusterId, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        collection_name: collectionName
    };

    this.rnr.deleteCollection(params, callback);

}

/*
Adds (indexes) a new document to a Solr collection on a Solr cluster on the RNR instance.
Requires a document object (see the RNR API on Bluemix for an example format), the cluster id of the cluster,
the name of the collection to add the document to, and a callback to handle the error and response messages.
*/
RNRService.prototype.addDocument = function(doc, clusterId, collectionName, callback) {

    var params = {
        cluster_id: clusterId,
        collection_name: collectionName
    };

    var solrClient = this.rnr.createSolrClient(params);

    solrClient.add(doc, function(err, response) {
        if (err) {
            console.log('Error indexing document: ', err);
        } else {
            console.log('Indexed a document.');
            solrClient.commit(function(err) {
                if (err) {
                    console.log('Error committing change: ' + err);
                } else {
                    console.log('Successfully committed changes.');
                    callback(err, response);
                }
            });

        }
    });

}

/*
Searchs a Solr collection on a Solr cluster with the given query.
Requires a question to search for, the cluster id of the cluster, the name of the collection to be searched,
and a callback to handle the error and response messages.
*/
RNRService.prototype.searchSolrCluster = function(question, clusterId, collectionName, callback) {
    
    var params = {
        cluster_id: clusterId,
        collection_name: collectionName,
    };
    
    var solrClient = this.rnr.createSolrClient(params);    
    
    var query = solrClient.createQuery();
    query.q(question);

    solrClient.search(query, callback);
    
}

/*
Creates and trains a new ranker on the RNR instance.
Requires a path to a training data file in CSV format and a callback to handle the error and response messages. 
*/
RNRService.prototype.createRanker = function(trainingData, callback) {
    
    var params = {
        training_data: fs.createReadStream(trainingData)
    };
    
    this.rnr.createRanker(params, callback);
    
}

/*
Lists information about the current rankers on the RNR instance.
Requires a callback to handle the error and response messages.
*/
RNRService.prototype.listRankers = function(callback) {
    
    this.rnr.listRankers({}, callback);
    
}

/*
Gets detailed information about a specific ranker on the RNR instance.
Requires the id of the ranker to get information about and a callback to handle the error and response messages.
*/
RNRService.prototype.rankerStatus = function(rankerId, callback) {
    
    var params = {
      ranker_id: rankerId  
    };
    
    this.rnr.rankerStatus(params, callback);
    
}

/*
Deletes a ranker on the RNR instance.
Requires the id of the ranker that you want to delete and a callback to handle the error and response messages.
*/
RNRService.prototype.deleteRanker = function(rankerId, callback) {
    
    var params = {
      ranker_id: rankerId  
    };
    
    this.rnr.deleteRanker(params, callback);
    
}

/*
Ranks a list of given search results and returns the top answer and a list of ranked answers and their confidence score.
Reuires the ranker id of the ranker to use, the path to a file containing the search results in CSV format,
and a callback to handle the error and response messages.
*/
RNRService.prototype.rank = function(rankerId, answerData, callback) {
    
    var params = {
      ranker_id: rankerId,
      answer_data: fs.createReadStream(answerData)
    };
    
    this.rnr.rank(params, callback);
    
}

/*
Returns answers from a collection reranked for the given query using a given ranker on the RNR instance.
Requires the cluster id of the cluster, the name of the collection to search, the ranker id of the ranker to use,
the question to search for, and a callback to handle the error and response messages.
*/
RNRService.prototype.searchAndRank = function(clusterId, collectionName, rankerId, question, callback) {
    
    var params = {
      cluster_id: clusterId,
      collection_name: collectionName
    };
    
    var qs = require('qs');
    
    var solrClient = this.rnr.createSolrClient(params);
    
    var query = qs.stringify({q: question, ranker_id: rankerId, fl: 'id,title'});
    
    solrClient.get('fcselect', query, callback);
    
}

/*
Retrieves disk memory usage about a Solr cluster on the RNR instance.
Requires the cluster id of the cluster and a callback to handle the error and response messages.
*/
RNRService.prototype.getClusterStats = function(clusterId, callback) {
    
    var params = {
      cluster_id: clusterId
    };
    
    this.rnr.getClusterStats(params, callback);
    
}

module.exports.RNRService = RNRService;