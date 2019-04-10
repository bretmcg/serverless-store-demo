// Copyright 2018 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Script for configuring Firebase.
// See https://firebase.google.com/docs/web/setup for more information.

var config = {
    apiKey: "AIzaSyDtqZCveMcH4TslUg-wCYI8aFlvsIwWVxk",
    authDomain: "soft-serverless.firebaseapp.com",
    databaseURL: "https://soft-serverless.firebaseio.com",
    projectId: "soft-serverless",
    storageBucket: "soft-serverless.appspot.com",
    messagingSenderId: "682657597045"
};

firebase.initializeApp(config);
